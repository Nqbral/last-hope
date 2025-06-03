import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { HttpService } from '@nestjs/axios';
import { WsException } from '@nestjs/websockets';
import { Player } from '@shared/classes/Player';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';
import { ServerEvents } from '@shared/enums/ServerEvents';
import { ServerPayloads } from '@shared/types/ServerPayloads';
import { Server } from 'socket.io';
import { v4 } from 'uuid';

import { Instance } from '../instance/instance';

const PLAYER_COLORS = [
  'amber-400',
  'red-400',
  'blue-400',
  'emerald-400',
  'violet-400',
  'purple-400',
  'cyan-400',
  'rose-950',
];

export class Lobby {
  public readonly id: string = v4();

  public updatedAt: Date = new Date();

  public clients: AuthenticatedSocket[] = [];

  public stateLobby: string = LOBBY_STATES.IN_LOBBY;

  public stateBeforePause: string = '';

  public players: Player[] = [];

  public readonly instance: Instance = new Instance(this, this.httpService);

  constructor(
    private readonly server: Server,
    public readonly owner: AuthenticatedSocket,
    private readonly httpService: HttpService,
  ) {}

  public addClient(newClient: AuthenticatedSocket): void {
    const existing = this.players.find((p) => p.userId === newClient.userId);

    if (existing) {
      existing.disconnected = false;
      newClient.join(this.id);
      newClient.lobby = this;

      this.unPauseGame();
      this.dispatchLobbyState();
      return;
    }

    if (
      this.stateLobby == LOBBY_STATES.GAME_DELETED ||
      this.stateLobby == LOBBY_STATES.GAME_FINISHED_BY_LEAVING
    ) {
      this.server.to(newClient.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby finished',
        message:
          "La partie n'est pas joignable car elle est terminée ou supprimée.",
      });
      return;
    }

    if (this.stateLobby != LOBBY_STATES.IN_LOBBY) {
      this.server.to(newClient.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby in progress',
        message:
          'La partie est déjà en cours. Vous ne pouvez pas la rejoindre.',
      });
      return;
    }

    if (this.clients.length >= 8) {
      this.server.to(newClient.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby full',
        message: 'La partie est déjà pleine.',
      });
      throw new WsException('Trop de joueurs');
    }

    this.clients.push(newClient);
    newClient.join(this.id);

    newClient.lobby = this;

    this.players.push(new Player(newClient.userId, newClient.userName));
    this.initColorsPlayers();

    this.dispatchLobbyState();
  }

  public getPlayerById(userId: string): Player | undefined {
    return this.players.find((p) => p.userId === userId);
  }

  public removeClient(userId: string): void {
    this.clients = this.clients.filter((c) => c.userId !== userId);
    this.players = this.players.filter((p) => p.userId !== userId);
  }

  private initColorsPlayers(): void {
    this.players.forEach((player, index) => {
      player.color = PLAYER_COLORS[index];
    });
  }

  public startGame(client: AuthenticatedSocket): void {
    this.instance.triggerStart(client);
  }

  public pauseGame(): void {
    this.stateBeforePause = this.stateLobby;
    this.stateLobby = LOBBY_STATES.GAME_PAUSED;

    this.dispatchLobbyState();
  }

  public unPauseGame(): void {
    const playersDisconnected = this.players.filter((p) => p.disconnected);

    if (
      playersDisconnected.length == 0 &&
      this.stateLobby == LOBBY_STATES.GAME_PAUSED
    ) {
      this.stateLobby = this.stateBeforePause;
      this.stateBeforePause = '';
    }
  }

  public leaveLobby(client: AuthenticatedSocket): void {
    this.removeClient(client.userId);
    client.lobby = null;
    client.leave(this.id);
    client.emit(ServerEvents.LobbyLeave);

    if (this.stateLobby !== LOBBY_STATES.IN_LOBBY) {
      this.stateLobby = LOBBY_STATES.GAME_FINISHED_BY_LEAVING;
    }

    this.dispatchLobbyState();
  }

  public deleteLobby(): void {
    this.stateLobby = LOBBY_STATES.GAME_DELETED;

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void {
    this.updatedAt = new Date();
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      ownerId: this.owner.userId,
      stateLobby: this.stateLobby,
      players: this.players,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
