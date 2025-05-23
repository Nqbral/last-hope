import { ServerEvents } from "../enums/ServerEvents";
import { Player } from "../classes/Player";

export type ServerPayloads = {
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
};
