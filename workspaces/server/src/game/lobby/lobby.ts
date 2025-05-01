import { Player } from '@app/game/player/player';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
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

  protected clients: AuthenticatedSocket[] = [];

  protected players: Player[] = [];

  constructor(
    private readonly server: Server,
    public readonly owner: AuthenticatedSocket,
  ) {}

  public addClient(client: AuthenticatedSocket): void {
    this.clients.push(client);

    this.players.push(
      new Player(
        client.userId,
        client.userName,
        PLAYER_COLORS[this.players.length],
      ),
    );
  }
}
