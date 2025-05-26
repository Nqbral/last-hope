import { CLIENT_EVENTS } from "../consts/ClientEvents";

export type ClientSocketEvents = {
  // Lobby
  [CLIENT_EVENTS.LOBBY_CREATE]: undefined;
  [CLIENT_EVENTS.LOBBY_JOIN]: { lobbyIdJoin: string };
  [CLIENT_EVENTS.LOBBY_START_GAME]: undefined;
  [CLIENT_EVENTS.LOBBY_LEAVE]: undefined;
  [CLIENT_EVENTS.LOBBY_DELETE]: undefined;

  // Game
  [CLIENT_EVENTS.GAME_READY]: undefined;
  [CLIENT_EVENTS.BACK_TO_PLAYER_TURN]: undefined;
  [CLIENT_EVENTS.CHECKING_OTHER_CARDS]: { idOtherPlayer: string };
  [CLIENT_EVENTS.DRAW_OTHER_PLAYER_CARD]: {
    indexCardDraw: number;
  };
};
