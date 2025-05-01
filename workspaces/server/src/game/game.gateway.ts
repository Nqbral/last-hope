import { AuthService } from '@app/auth/auth.service';
import { JwtWsGuard } from '@app/auth/guards/jwt-ws.guard';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AUTH_EVENTS } from '@shared/consts/AuthEvents';
import { CLIENT_EVENTS } from '@shared/consts/ClientEvents';
import { firstValueFrom } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly lobbyManager: LobbyManager,
    private readonly httpService: HttpService,
  ) {}

  async handleConnection(client: any) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.authService.verifyToken(token);
      client.user = payload; // Stocker l'utilisateur dans le client
    } catch (err) {
      client.disconnect();
    }

    console.log(`Utilisateur connecté : ${client.user.sub}`);
  }

  async handleDisconnect(client: any) {
    console.log(`Utilisateur déconnecté : ${client.user.sub}`);
  }

  async getUsername(accessToken: string): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_WS_API_AUTH_URL}/user/profile/`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data.username;
  }

  @SubscribeMessage(CLIENT_EVENTS.LOBBY_CREATE)
  async createLobby(@ConnectedSocket() client: AuthenticatedSocket) {
    const lobby = this.lobbyManager.createLobby(client);

    if (client.userName == undefined) {
      client.userName = await this.getUsername(client.handshake.auth.token);
    }

    lobby.addClient(client);
  }

  @SubscribeMessage(AUTH_EVENTS.UPDATE_TOKEN)
  async handleUpdateToken(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { token: string },
  ) {
    try {
      const { token } = payload;

      const user = await this.authService.verifyToken(token);
      client.userId = user.sub; // Met à jour le userId sur la connexion existante
      client.userName = await this.getUsername(token);

      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du token', err);
      client.disconnect(); // Déconnecte si le nouveau token est invalide
      return { success: false, message: 'Token invalide' };
    }
  }
}
