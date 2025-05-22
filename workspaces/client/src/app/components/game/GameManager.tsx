'use client';

import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Listener } from '@lib/SocketManager';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import GameLobby from './GameLobby';

export default function GameManager() {
  const searchParams = useSearchParams();
  const { isConnectedSocket, addListener, removeListener, emitEvent } =
    useSocket();

  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
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

    addListener(ServerEvents.LobbyState, onLobbyState);

    return () => {
      removeListener(ServerEvents.LobbyState, onLobbyState);
    };
  }, [isConnectedSocket, addListener, removeListener]);

  useEffect(() => {
    if (!isConnectedSocket) {
      return;
    }

    const lobbyIdJoin = searchParams.get('lobby');

    if (lobbyIdJoin != null) {
      emitEvent(CLIENT_EVENTS.LOBBY_JOIN, { lobbyIdJoin: lobbyIdJoin });
    }
  }, [emitEvent, searchParams, isConnectedSocket]);

  if (lobbyState.lobbyId != '') {
    return <GameLobby lobbyState={lobbyState} />;
  }

  return <></>;
}
