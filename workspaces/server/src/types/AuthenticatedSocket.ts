import { Lobby } from '@app/game/lobby/lobby';
import { Socket } from 'socket.io';

export class AuthenticatedSocket extends Socket {
  public userId: string;

  public userName: string;

  public token: string;

  public lobby: Lobby | null;
}
