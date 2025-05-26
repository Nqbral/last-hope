import { ServerEvents } from "../enums/ServerEvents";
import { Player } from "../classes/Player";
import { Card } from "../classes/Card";
import { HistoryEvent } from "../classes/HistoryEvent";

export type ServerPayloads = {
  [ServerEvents.LobbyCreate]: {
    lobbyId: string;
  };

  [ServerEvents.LobbyState]: {
    lobbyId: string;
    ownerId: string;
    stateLobby: string;
    players: Player[];
  };

  [ServerEvents.LobbyError]: {
    error: string;
    message: string;
  };

  [ServerEvents.GameState]: {
    lobbyId: string;
    stateGame: string;
    roundNumber: number;
    players: Player[];
    remediesToFind: number;
    playerTurn: Player | null;
    checkedPlayerHand: Player | null;
    cardsDisplayedRound: Card[];
    remediesFound: number;
    statusFinish: string;
    historyEvents: HistoryEvent[];
  };
};
