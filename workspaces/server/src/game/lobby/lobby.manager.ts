import { Lobby } from '@app/game/lobby/lobby';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public createLobby(owner: AuthenticatedSocket, user: any): Lobby {
    console.log('create');
    console.log(user);
    const lobby = new Lobby(this.server, owner);

    this.lobbies.set(lobby.id, lobby);

    lobby.addClient(owner);

    return lobby;
  }

  protected getLobby(lobbyId: string, client: AuthenticatedSocket): Lobby {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      console.log('lobby not foud');
      throw new WsException('Lobby not found');
    }

    return lobby;
  }

  public joinLobby(
    lobbyId: string,
    client: AuthenticatedSocket,
    user: any,
  ): void {
    const lobby = this.getLobby(lobbyId, client);

    if (lobby.clients.length >= 8) {
      console.log('Trop de joueurs');
      throw new WsException('Trop de joueurs');
    }

    lobby.addClient(client);
  }
}
