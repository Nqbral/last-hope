export const CLIENT_EVENTS = {
  // Lobby
  LOBBY_CREATE: 'client.lobby.create',
  LOBBY_JOIN: 'client.lobby.join',
  LOBBY_LEAVE: 'client.lobby.leave',
  LOBBY_DELETE: 'client.lobby.delete',
} as const;

export type ClientSocketEvents = {
  // Lobby
  [CLIENT_EVENTS.LOBBY_CREATE]: undefined;
  [CLIENT_EVENTS.LOBBY_JOIN]: undefined;
  [CLIENT_EVENTS.LOBBY_LEAVE]: undefined;
  [CLIENT_EVENTS.LOBBY_DELETE]: undefined;
};
