import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { WsException } from '@nestjs/websockets';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';

import { Lobby } from '../lobby/lobby';

export class Instance {
  constructor(private readonly lobby: Lobby) {}

  public triggerStart(client: AuthenticatedSocket) {
    if (client.userId !== this.lobby.owner.userId) {
      throw new WsException('Only the owner can start the game.');
    }

    if (this.lobby.players.length < 4) {
      throw new WsException('Not enough players to start the game.');
    }

    if (this.lobby.players.length > 8) {
      throw new WsException('Too much players to start the game.');
    }

    this.lobby.stateLobby = LOBBY_STATES.GAME_STARTED;

    this.lobby.dispatchLobbyState();
  }
}
