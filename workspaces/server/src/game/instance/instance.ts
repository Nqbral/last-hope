import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { WsException } from '@nestjs/websockets';
import { Card } from '@shared/classes/Card';
import { Player } from '@shared/classes/Player';
import { Role } from '@shared/classes/Role';
import { BombCard } from '@shared/classes/cards/BombCard';
import { NeutralCard } from '@shared/classes/cards/NeutralCard';
import { RemedyCard } from '@shared/classes/cards/RemedyCard';
import { DoctorRole } from '@shared/classes/roles/DoctorRole';
import { InfectedRole } from '@shared/classes/roles/InfectedRole';
import { GAME_STATES } from '@shared/consts/GameStates';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';
import { ServerEvents } from '@shared/enums/ServerEvents';
import { ServerPayloads } from '@shared/types/ServerPayloads';

import { Lobby } from '../lobby/lobby';

export class Instance {
  public stateGame: string = '';
  public roundNumber: number = 1;
  public nbRemediesToFind: number = 0;
  public deck: Card[] = [];

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
      rolesToDispatch.push(new DoctorRole(this.nbRemediesToFind));
    }

    for (let index = 0; index < nbInfected; index++) {
      rolesToDispatch.push(new InfectedRole(this.nbRemediesToFind));
    }

    rolesToDispatch = this.shuffle(rolesToDispatch);

    this.lobby.players.forEach((player, index) => {
      player.role = rolesToDispatch[index];
      player.ready = false;
    });
  }

  private initCards(): void {
    this.deck = [];

    this.deck.push(new BombCard());

    for (let index = 0; index < this.nbRemediesToFind; index++) {
      this.deck.push(new RemedyCard());
    }

    while (this.deck.length < this.lobby.players.length * 5) {
      this.deck.push(new NeutralCard());
    }

    this.deck = this.shuffle(this.deck);
  }

  private dealCards(): void {
    const nbCardsToDeal = this.deck.length / this.lobby.players.length;

    this.lobby.players.forEach((player) => {
      player.hand = [];

      for (let cardsDealt = 0; cardsDealt < nbCardsToDeal; cardsDealt++) {
        let cardDealt = this.deck.pop();

        if (cardDealt != undefined) {
          player.hand.push(cardDealt);
        }
      }
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

  private switchToNextState(): void {
    switch (this.stateGame) {
      case GAME_STATES.ROLE_DISTRIBUTION:
        this.switchToCheckingCardsState();
        break;
      case GAME_STATES.CHECKING_CARDS:
        this.switchToInRoundState();
        break;
      default:
        throw new WsException('Game state not handled');
    }
  }

  private switchToCheckingCardsState(): void {
    this.stateGame = GAME_STATES.CHECKING_CARDS;

    this.lobby.players.forEach((p) => (p.ready = false));

    if (this.roundNumber == 1) {
      this.initCards();
    }

    this.dealCards();

    this.lobby.players.forEach((p) => p.orderCards());
  }

  private switchToInRoundState(): void {
    this.stateGame = GAME_STATES.IN_ROUND;

    this.lobby.players.forEach((p) => (p.hand = this.shuffle(p.hand)));
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
