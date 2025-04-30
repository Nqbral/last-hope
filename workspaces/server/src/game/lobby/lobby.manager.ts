import { Lobby } from '@app/game/lobby/lobby';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { Server } from 'socket.io';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public createLobby(owner: AuthenticatedSocket): Lobby {
    const lobby = new Lobby(this.server, owner);

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }
}
