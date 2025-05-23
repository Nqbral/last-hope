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
  WsException,
} from '@nestjs/websockets';
import { AUTH_EVENTS } from '@shared/consts/AuthEvents';
import { CLIENT_EVENTS } from '@shared/consts/ClientEvents';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';
import { ServerEvents } from '@shared/enums/ServerEvents';
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

      client.emit(ServerEvents.Authenticated, {
        userId: client.userId,
      });
    } catch (err) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (!client.lobby) return;

    const lobby = client.lobby;

    const player = lobby.getPlayerById?.(client.userId);
    if (player) {
      if (lobby.stateLobby === LOBBY_STATES.IN_LOBBY) {
        lobby.removeClient(client.userId);
      } else {
        player.disconnected = true;
        lobby.pauseGame();
        return;
      }

      lobby.dispatchLobbyState();
    }
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

      client.emit(ServerEvents.Authenticated, {
        userId: client.userId,
      });
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

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(CLIENT_EVENTS.LOBBY_START_GAME)
  handleStartGame(@ConnectedSocket() client: AuthenticatedSocket) {
    const lobby = client.lobby;

    if (!lobby) throw new WsException('Lobby introuvable');

    if (lobby.owner.userId !== client.userId) {
      throw new WsException("Vous n'êtes pas le propriétaire du lobby.");
    }

    lobby.startGame();
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(CLIENT_EVENTS.LOBBY_LEAVE)
  handleLeaveGame(@ConnectedSocket() client: AuthenticatedSocket) {
    const lobby = client.lobby;

    if (!lobby) throw new WsException('Lobby introuvable');

    lobby.leaveLobby(client);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(CLIENT_EVENTS.LOBBY_DELETE)
  handleDeleteLobby(@ConnectedSocket() client: AuthenticatedSocket) {
    const lobby = client.lobby;

    if (!lobby) throw new WsException('Lobby introuvable');

    if (lobby.owner.userId !== client.userId) {
      throw new WsException("Vous n'êtes pas le propriétaire du lobby.");
    }

    this.lobbyManager.deleteLobby(client, lobby.id);
  }
}
