import { CLIENT_EVENTS } from "../consts/ClientEvents";

export type ClientSocketEvents = {
  // Lobby
  [CLIENT_EVENTS.LOBBY_CREATE]: undefined;
  [CLIENT_EVENTS.LOBBY_JOIN]: undefined;
  [CLIENT_EVENTS.LOBBY_LEAVE]: undefined;
  [CLIENT_EVENTS.LOBBY_DELETE]: undefined;
};
