import { Lobby } from '@app/game/lobby/lobby';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { WsException } from '@nestjs/websockets';
import { ServerEvents } from '@shared/enums/ServerEvents';
import { Server } from 'socket.io';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public createLobby(owner: AuthenticatedSocket, user: any): Lobby {
    const lobby = new Lobby(this.server, owner);

    this.lobbies.set(lobby.id, lobby);

    lobby.addClient(owner);

    return lobby;
  }

  protected getLobby(lobbyId: string): Lobby {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      throw new WsException('Lobby not found');
    }

    return lobby;
  }

  public joinLobby(
    lobbyId: string,
    client: AuthenticatedSocket,
    user: any,
  ): void {
    const lobby = this.getLobby(lobbyId);

    if (lobby.clients.length >= 8) {
      this.server.to(client.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby full',
        message: 'La partie est déjà pleine.',
      });
      throw new WsException('Trop de joueurs');
    }

    lobby.addClient(client);
  }

  public deleteLobby(lobbyId: string): void {
    const lobby = this.getLobby(lobbyId);
    if (!lobby) return;

    lobby.deleteLobby();

    lobby.clients.forEach((client) => {
      client.leave(lobbyId);
      client.lobby = null;
    });
  }
}
