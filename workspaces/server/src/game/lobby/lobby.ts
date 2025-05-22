import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { Player } from '@shared/classes/player';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';
import { ServerEvents } from '@shared/enums/ServerEvents';
import { ServerPayloads } from '@shared/types/ServerPayloads';
import { Server } from 'socket.io';
import { v4 } from 'uuid';

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

  protected players: Player[] = [];

  constructor(
    private readonly server: Server,
    public readonly owner: AuthenticatedSocket,
  ) {}

  public addClient(newClient: AuthenticatedSocket): void {
    if (
      this.clients.findIndex((client) => {
        return client.userId == newClient.userId;
      }) != -1
    ) {
      // console.log('Utilisateur a deja rejoint');
      this.dispatchLobbyState();
      return;
    }

    this.clients.push(newClient);
    newClient.join(this.id);

    newClient.lobby = this;

    this.players.push(new Player(newClient.userId, newClient.userName));
    this.initColorsPlayers();

    this.dispatchLobbyState();
  }

  private initColorsPlayers(): void {
    this.players.forEach((player, index) => {
      player.color = PLAYER_COLORS[index];
    });
  }

  public dispatchLobbyState(): void {
    this.updatedAt = new Date();
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      stateLobby: this.stateLobby,
      players: this.players,
    };

    console.log(this.players);

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
