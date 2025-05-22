import { AuthService } from '@app/auth/auth.service';
import { CurrentUser } from '@app/auth/decorators/current-user.decorator';
import { JwtWsGuard } from '@app/auth/guards/jwt-ws.guard';
import { AttachUserInterceptor } from '@app/auth/interceptors/attach-user.interceptor';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { HttpService } from '@nestjs/axios';
import { UseGuards, UseInterceptors } from '@nestjs/common';
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
import { Server } from 'socket.io';

import { LobbyJoinDto } from './lobby/dtos';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly lobbyManager: LobbyManager,
    private readonly httpService: HttpService,
  ) {}

  afterInit(server: Server): any {
    // Pass server instance to managers
    this.lobbyManager.server = server;
  }

  async handleConnection(client: any) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.authService.verifyToken(token);
      client.user = payload; // Stocker l'utilisateur dans le client
      client.userId = client.user.sub; // Met à jour le userId sur la connexion existante
      client.userName = await this.authService.getUsername(token);
      client.token = token;
    } catch (err) {
      client.disconnect();
    }

    console.log(`Utilisateur connecté : ${client.user.sub}`);
  }

  async handleDisconnect(client: any) {
    console.log(`Utilisateur déconnecté : ${client.user.sub}`);
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
      client.userName = await this.authService.getUsername(token);
      client.token = token;

      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du token', err);
      client.disconnect(); // Déconnecte si le nouveau token est invalide
      return { success: false, message: 'Token invalide' };
    }
  }

  @UseGuards(JwtWsGuard)
  @UseInterceptors(AttachUserInterceptor)
  @SubscribeMessage(CLIENT_EVENTS.LOBBY_CREATE)
  async createLobby(
    @ConnectedSocket() client: AuthenticatedSocket,
    @CurrentUser() user: any,
  ) {
    this.lobbyManager.createLobby(client, user);
  }

  @UseGuards(JwtWsGuard)
  @UseInterceptors(AttachUserInterceptor)
  @SubscribeMessage(CLIENT_EVENTS.LOBBY_JOIN)
  onLobbyJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: LobbyJoinDto,
    @CurrentUser() user: any,
  ): void {
    this.lobbyManager.joinLobby(data.lobbyIdJoin, client, user);
  }
}
