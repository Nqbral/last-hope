import { AuthService } from '@app/auth/auth.service';
import { JwtWsGuard } from '@app/auth/guards/jwt-ws.guard';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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

    console.log(`Utilisateur connecté : ${client.id}`);
  }

  async handleDisconnect(client: any) {
    console.log(`Client déconnecté : ${client.id}`);
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

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(CLIENT_EVENTS.LOBBY_CREATE)
  async createLobby(@ConnectedSocket() client: AuthenticatedSocket) {
    const lobby = this.lobbyManager.createLobby(client);

    client.userName = await this.getUsername(client.handshake.auth.token);
    lobby.addClient(client);
  }
}
