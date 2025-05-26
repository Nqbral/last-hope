export enum ServerEvents {
  // Auth
  Authenticated = "server.authenticated",

  // Lobby
  LobbyState = "server.lobby.state",
  LobbyError = "server.lobby.error",
  LobbyCreate = "server.lobby.create",
  LobbyJoin = "server.lobby.join",
  LobbyLeave = "server.lobby.leave",

  // Game
  GameState = "server.game.state",
}
