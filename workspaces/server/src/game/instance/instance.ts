import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { WsException } from '@nestjs/websockets';
import { Player } from '@shared/classes/Player';
import { Role } from '@shared/classes/Role';
import { Doctor } from '@shared/classes/roles/Doctor';
import { Infected } from '@shared/classes/roles/Infected';
import { GAME_STATES } from '@shared/consts/GameStates';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';
import { ServerEvents } from '@shared/enums/ServerEvents';
import { ServerPayloads } from '@shared/types/ServerPayloads';

import { Lobby } from '../lobby/lobby';

export class Instance {
  public stateGame: string = '';
  public roundNumber = 1;
  public nbRemediesToFind = 0;

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
    this.nbRemediesToFind = this.lobby.players.length;
    this.initRoles();
    this.roundNumber = 1;
    this.stateGame = GAME_STATES.ROLE_DISTRIBUTION;

    this.lobby.dispatchLobbyState();
    this.dispatchGameState();
  }

  private initRoles(): void {
    let nbDoctors = 0;
    let nbInfected = 0;

    switch (this.lobby.players.length) {
      case 4:
      case 5:
        nbDoctors = 3;
        nbInfected = 2;
        break;
      case 6:
        nbDoctors = 4;
        nbInfected = 2;
        break;
      case 7:
      case 8:
        nbDoctors = 5;
        nbInfected = 3;
        break;
      default:
        throw new WsException(
          'Error while initializing roles : number players incorrect',
        );
    }

    let rolesToDispatch: Role[] = [];

    for (let index = 0; index < nbDoctors; index++) {
      rolesToDispatch.push(new Doctor(this.nbRemediesToFind));
    }

    for (let index = 0; index < nbInfected; index++) {
      rolesToDispatch.push(new Infected(this.nbRemediesToFind));
    }

    rolesToDispatch = this.shuffle(rolesToDispatch);

    this.lobby.players.forEach((player, index) => {
      player.role = rolesToDispatch[index];
      player.ready = false;
    });
  }

  private shuffle(array: any[]): any[] {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  public onGameReady(client: AuthenticatedSocket): void {
    let player = this.findPlayerOnClient(client);

    player.ready = true;

    if (this.checkAllPlayersAreReady()) {
      this.switchToNextState();
    }

    this.dispatchGameState();
  }

  private checkAllPlayersAreReady(): boolean {
    const playersNotReady = this.lobby.players.filter((player) => {
      return !player.ready;
    });

    return playersNotReady.length == 0;
  }

  private switchToNextState() {
    if (GAME_STATES.ROLE_DISTRIBUTION) {
      this.stateGame = GAME_STATES.CHECKING_CARDS;
    }
  }

  private findPlayerOnClient(client: AuthenticatedSocket): Player {
    let player = this.lobby.players.find(
      (player) => player.userId == client.userId,
    );

    if (player == undefined) {
      throw new WsException('Player not found in lobby');
    }

    return player;
  }

  public dispatchGameState(): void {
    this.lobby.updatedAt = new Date();

    const payload: ServerPayloads[ServerEvents.GameState] = {
      lobbyId: this.lobby.id,
      stateGame: this.stateGame,
      roundNumber: this.roundNumber,
      players: this.lobby.players,
      remediesToFind: this.nbRemediesToFind,
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, payload);
  }
}
