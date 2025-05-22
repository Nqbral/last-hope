import { ServerEvents } from "../enums/ServerEvents";
import { Player } from "../classes/Player";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    stateLobby: string;
    players: Player[];
  };
};
