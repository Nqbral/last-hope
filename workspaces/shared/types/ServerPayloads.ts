import { ServerEvents } from "../enums/ServerEvents";
import { Player } from "../classes/Player";

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
  };
};
