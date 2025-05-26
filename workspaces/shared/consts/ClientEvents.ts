export const CLIENT_EVENTS = {
  // Lobby
  LOBBY_CREATE: "client.lobby.create",
  LOBBY_JOIN: "client.lobby.join",
  LOBBY_START_GAME: "client.lobby.start.game",
  LOBBY_LEAVE: "client.lobby.leave",
  LOBBY_DELETE: "client.lobby.delete",

  // Game
  GAME_READY: "client.game.ready",
  BACK_TO_PLAYER_TURN: "client.game.back.to.player.turn",
  CHECKING_OTHER_CARDS: "client.game.checking_other.cards",
  DRAW_OTHER_PLAYER_CARD: "client.game.draw.other.player.card",
} as const;
