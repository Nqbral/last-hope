import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { HttpService } from '@nestjs/axios';
import { WsException } from '@nestjs/websockets';
import { Card } from '@shared/classes/Card';
import { HistoryEvent } from '@shared/classes/HistoryEvent';
import { Player } from '@shared/classes/Player';
import { Role } from '@shared/classes/Role';
import { BombCard } from '@shared/classes/cards/BombCard';
import { NeutralCard } from '@shared/classes/cards/NeutralCard';
import { RemedyCard } from '@shared/classes/cards/RemedyCard';
import { NextRoundHistoryEvent } from '@shared/classes/historyevents/NextRoundHistoryEvent';
import { PickCardHistoryEvent } from '@shared/classes/historyevents/PickCardHistoryEvent';
import { DoctorRole } from '@shared/classes/roles/DoctorRole';
import { InfectedRole } from '@shared/classes/roles/InfectedRole';
import { GAME_FINISH_STATUSES } from '@shared/consts/GameFinishStatuses';
import { GAME_STATES } from '@shared/consts/GameStates';
import { LOBBY_STATES } from '@shared/consts/LobbyStates';
import { NAME_CARD } from '@shared/consts/NameCard';
import { NAME_ROLE } from '@shared/consts/NameRole';
import { ServerEvents } from '@shared/enums/ServerEvents';
import { ServerPayloads } from '@shared/types/ServerPayloads';
import { lastValueFrom } from 'rxjs';

import { Lobby } from '../lobby/lobby';

export class Instance {
  private stateGame: string = '';
  private roundNumber: number = 1;
  private nbRemediesToFind: number = 0;
  private deck: Card[] = [];
  private playerTurn: Player | null = null;
  private checkedPlayerHand: Player | null = null;
  private cardsDisplayedRound: Card[] = [];
  private remediesFound: number = 0;
  private statusFinish: string = '';
  private historyEvents: HistoryEvent[] = [];

  constructor(
    private readonly lobby: Lobby,
    private readonly httpService: HttpService,
  ) {}

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

    this.stateGame = GAME_STATES.ROLE_DISTRIBUTION;
    this.roundNumber = 1;
    this.nbRemediesToFind = this.lobby.players.length;
    this.initRoles();
    this.deck = [];
    this.selectRandomPlayerTurn();
    this.checkedPlayerHand = null;
    this.cardsDisplayedRound = [];
    this.remediesFound = 0;
    this.statusFinish = '';
    this.historyEvents = [];

    this.historyEvents.push(new NextRoundHistoryEvent(this.roundNumber));

    if (this.lobby.stateLobby != LOBBY_STATES.GAME_STARTED) {
      this.lobby.stateLobby = LOBBY_STATES.GAME_STARTED;
      this.lobby.dispatchLobbyState();
    }

    this.dispatchGameState();
  }

  private async updatePlayerStats(
    userId: string,
    token: string,
    stats: { gamesPlayed?: number; wins?: number; losses?: number },
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.put(
          `${process.env.NEXT_PUBLIC_WS_API_AUTH_URL}/user/stats/last-hope`,
          stats,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
      return response.data;
    } catch (err) {
      console.error(
        `Erreur lors de la mise à jour des stats du joueur ${userId}`,
        err?.response?.data || err.message,
      );
    }
  }

  private async triggerFinish(statusFinish: string) {
    this.stateGame = GAME_STATES.GAME_FINISHED;
    this.statusFinish = statusFinish;

    const doctors = this.lobby.players.filter(
      (p) => p.role?.nameRole == NAME_ROLE.DOCTOR,
    );
    const infected = this.lobby.players.filter(
      (p) => p.role?.nameRole == NAME_ROLE.INFECTED,
    );

    const doctorsClients = doctors.map((p) => {
      return this.lobby.clients.find((c) => {
        return p.userId == c.userId;
      });
    });

    const infectedClients = infected.map((p) => {
      return this.lobby.clients.find((c) => {
        return p.userId == c.userId;
      });
    });

    if (statusFinish == GAME_FINISH_STATUSES.DOCTORS_WIN) {
      for (const doctorClient of doctorsClients) {
        if (doctorClient?.userId) {
          await this.updatePlayerStats(
            doctorClient.userId,
            doctorClient.token,
            {
              gamesPlayed: 1,
              wins: 1,
              losses: 0,
            },
          );
        }
      }

      for (const infectedClient of infectedClients) {
        if (infectedClient?.userId) {
          await this.updatePlayerStats(
            infectedClient.userId,
            infectedClient.token,
            {
              gamesPlayed: 1,
              wins: 0,
              losses: 1,
            },
          );
        }
      }
    }

    if (
      statusFinish == GAME_FINISH_STATUSES.INFECTED_WIN_BY_BOMB ||
      statusFinish == GAME_FINISH_STATUSES.INFECTED_WIN_BY_TIME
    ) {
      for (const doctorClient of doctorsClients) {
        if (doctorClient?.userId) {
          await this.updatePlayerStats(
            doctorClient.userId,
            doctorClient.token,
            {
              gamesPlayed: 1,
              wins: 0,
              losses: 1,
            },
          );
        }
      }

      for (const infectedClient of infectedClients) {
        if (infectedClient?.userId) {
          await this.updatePlayerStats(
            infectedClient.userId,
            infectedClient.token,
            {
              gamesPlayed: 1,
              wins: 1,
              losses: 0,
            },
          );
        }
      }
    }

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

  private selectRandomPlayerTurn(): void {
    let randomIndex = Math.floor(Math.random() * this.lobby.players.length);

    this.playerTurn = this.lobby.players[randomIndex];
  }

  public onGameReady(client: AuthenticatedSocket): void {
    let player = this.findPlayerOnUserId(client.userId);

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
        this.switchToPlayerTurnState();
        break;
      case GAME_STATES.RECAP_ROUND:
        this.switchToNextRound();
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

  private switchToPlayerTurnState(): void {
    this.stateGame = GAME_STATES.PLAYER_TURN;

    this.lobby.players.forEach((p) => (p.hand = this.shuffle(p.hand)));
  }

  private switchToNextRound(): void {
    this.stateGame = GAME_STATES.CHECKING_CARDS;
    this.deck = [];
    this.cardsDisplayedRound = [];

    this.lobby.players.forEach((player) => {
      player.hand.forEach((card) => {
        this.deck.push(card);
      });
      player.hand = [];
      player.ready = false;
    });

    this.deck = this.shuffle(this.deck);

    this.dealCards();
    this.lobby.players.forEach((p) => p.orderCards());

    this.historyEvents.push(new NextRoundHistoryEvent(this.roundNumber));
  }

  private findPlayerOnUserId(userId: string): Player {
    let player = this.lobby.players.find((player) => player.userId == userId);

    if (player == undefined) {
      throw new WsException('Player not found in lobby');
    }

    return player;
  }

  public onCheckingOtherHand(
    client: AuthenticatedSocket,
    idPlayer: string,
  ): void {
    this.checkedPlayerHand = null;

    if (client.userId != this.playerTurn?.userId) {
      throw new WsException('Not player turn.');
    }

    if (client.userId == idPlayer) {
      throw new WsException("Can't check your own hand.");
    }

    this.checkedPlayerHand = this.findPlayerOnUserId(idPlayer);
    this.stateGame = GAME_STATES.CHECKING_OTHER_PLAYER_CARDS;

    this.dispatchGameState();
  }

  public onBackToPlayerTurn(client: AuthenticatedSocket): void {
    if (client.userId != this.playerTurn?.userId) {
      throw new WsException('Not player turn.');
    }

    this.checkedPlayerHand = null;

    this.stateGame = GAME_STATES.PLAYER_TURN;

    this.dispatchGameState();
  }

  public onDrawOtherPlayerCard(
    client: AuthenticatedSocket,
    indexCardDraw: number,
  ): void {
    if (client.userId != this.playerTurn?.userId) {
      throw new WsException('Not player turn.');
    }

    if (this.checkedPlayerHand != null) {
      if (
        indexCardDraw < 0 ||
        indexCardDraw >= this.checkedPlayerHand.hand.length
      ) {
        throw new WsException('Index card draw incorrect.');
      }

      const cardDraw = this.checkedPlayerHand.hand[indexCardDraw];
      cardDraw.displayedCard = true;

      this.historyEvents.push(
        new PickCardHistoryEvent(
          this.playerTurn,
          this.checkedPlayerHand,
          cardDraw,
        ),
      );

      if (cardDraw.nameCard == NAME_CARD.REMEDY) {
        this.remediesFound++;
      }

      if (this.remediesFound >= this.nbRemediesToFind) {
        this.triggerFinish(GAME_FINISH_STATUSES.DOCTORS_WIN);
        return;
      }

      if (cardDraw.nameCard == NAME_CARD.BOMB) {
        this.triggerFinish(GAME_FINISH_STATUSES.INFECTED_WIN_BY_BOMB);
        return;
      }

      this.stateGame = GAME_STATES.OTHER_PLAYER_CARD_DRAW;
      this.dispatchGameState();

      setTimeout(() => {
        this.setPlayerNextTurn(indexCardDraw, cardDraw);
      }, 5000);
    }

    throw new WsException('checkedPlayerHand not ok.');
  }

  private setPlayerNextTurn(indexCardDraw: number, cardDraw: Card) {
    this.cardsDisplayedRound.push(cardDraw);
    this.checkedPlayerHand?.hand.splice(indexCardDraw, 1);
    this.playerTurn = this.checkedPlayerHand;
    this.checkedPlayerHand = null;

    if (this.cardsDisplayedRound.length >= this.lobby.players.length) {
      this.roundNumber++;

      if (this.roundNumber >= 5) {
        this.triggerFinish(GAME_FINISH_STATUSES.INFECTED_WIN_BY_TIME);
        return;
      }

      this.stateGame = GAME_STATES.RECAP_ROUND;
      this.lobby.players.forEach((p) => (p.ready = false));
      this.dispatchGameState();
      return;
    }

    this.stateGame = GAME_STATES.PLAYER_TURN;
    this.dispatchGameState();
  }

  public dispatchGameState(): void {
    this.lobby.updatedAt = new Date();

    const payload: ServerPayloads[ServerEvents.GameState] = {
      lobbyId: this.lobby.id,
      stateGame: this.stateGame,
      roundNumber: this.roundNumber,
      players: this.lobby.players,
      remediesToFind: this.nbRemediesToFind,
      playerTurn: this.playerTurn,
      checkedPlayerHand: this.checkedPlayerHand,
      cardsDisplayedRound: this.cardsDisplayedRound,
      remediesFound: this.remediesFound,
      statusFinish: this.statusFinish,
      historyEvents: this.historyEvents,
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, payload);
  }
}
