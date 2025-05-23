'use client';

import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { LOBBY_STATES } from '@last-hope/shared/consts/LobbyStates';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Listener } from '@lib/SocketManager';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import GameLobby from './GameLobby';
import GameLobbyDeleted from './GameLobbyDeleted';
import GameLobbyError from './GameLobbyError';

export default function GameManager() {
  const searchParams = useSearchParams();
  const { isConnectedSocket, addListener, removeListener, emitEvent } =
    useSocket();
  const [hasJoined, setHasJoined] = useState(false);
  const [lobbyError, setLobbyError] = useState<
    ServerPayloads[ServerEvents.LobbyError]
  >({ error: '', message: '' });
  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
    ownerId: '',
    stateLobby: '',
    players: [],
  });

  useEffect(() => {
    if (!isConnectedSocket) {
      return;
    }

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      setLobbyState(data);
    };

    const onLobbyError: Listener<ServerPayloads[ServerEvents.LobbyError]> = (
      data,
    ) => {
      setLobbyError(data);
    };

    addListener(ServerEvents.LobbyState, onLobbyState);
    addListener(ServerEvents.LobbyError, onLobbyError);

    return () => {
      removeListener(ServerEvents.LobbyState, onLobbyState);
      removeListener(ServerEvents.LobbyError, onLobbyError);
    };
  }, [isConnectedSocket, addListener, removeListener]);

  useEffect(() => {
    if (!isConnectedSocket || hasJoined) return;

    const lobbyIdJoin = searchParams.get('lobby');

    if (lobbyIdJoin) {
      emitEvent(CLIENT_EVENTS.LOBBY_JOIN, { lobbyIdJoin });
      setHasJoined(true);
    }
  }, [emitEvent, searchParams, isConnectedSocket, hasJoined]);

  if (lobbyError.error != '') {
    return <GameLobbyError error={lobbyError} />;
  }

  if (lobbyState.lobbyId != '') {
    switch (lobbyState.stateLobby) {
      case LOBBY_STATES.IN_LOBBY:
        return <GameLobby lobbyState={lobbyState} />;
      case LOBBY_STATES.GAME_DELETED:
        return <GameLobbyDeleted />;
    }
  }

  return <></>;
}
