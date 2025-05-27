'use client';

import Navbar from '@components/navbar/Navbar';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { LOBBY_STATES } from '@last-hope/shared/consts/LobbyStates';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Listener } from '@lib/SocketManager';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Triangle } from 'react-loader-spinner';

import Game from './Game';
import GameLobby from './GameLobby';
import GameLobbyDeleted from './GameLobbyDeleted';
import GameLobbyError from './GameLobbyError';

export default function GameManager() {
  const searchParams = useSearchParams();
  const { isConnectedSocket, addListener, removeListener, emitEvent } =
    useSocket();
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [gameState, setGameState] = useState<
    ServerPayloads[ServerEvents.GameState]
  >({
    lobbyId: '',
    stateGame: '',
    players: [],
    roundNumber: 1,
    remediesToFind: 1,
    playerTurn: null,
    checkedPlayerHand: null,
    cardsDisplayedRound: [],
    remediesFound: 0,
    statusFinish: '',
    historyEvents: [],
  });

  useEffect(() => {
    if (!isConnectedSocket) {
      return;
    }

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      setLobbyState(data);
      setLoading(false);
    };

    const onGameState: Listener<ServerPayloads[ServerEvents.GameState]> = (
      data,
    ) => {
      setGameState(data);
    };

    const onLobbyError: Listener<ServerPayloads[ServerEvents.LobbyError]> = (
      data,
    ) => {
      setLobbyError(data);
      setHasJoined(false);
      setLoading(false);
    };

    addListener(ServerEvents.LobbyState, onLobbyState);
    addListener(ServerEvents.GameState, onGameState);
    addListener(ServerEvents.LobbyError, onLobbyError);

    return () => {
      removeListener(ServerEvents.LobbyState, onLobbyState);
      removeListener(ServerEvents.GameState, onGameState);
      removeListener(ServerEvents.LobbyError, onLobbyError);
    };
  }, [isConnectedSocket, addListener, removeListener]);

  useEffect(() => {
    if (!isConnectedSocket || hasJoined) {
      setLoading(false);
      return;
    }

    setLobbyError({ error: '', message: '' });

    const lobbyIdJoin = searchParams.get('lobby');

    if (lobbyIdJoin) {
      console.log(lobbyIdJoin);
      emitEvent(CLIENT_EVENTS.LOBBY_JOIN, { lobbyIdJoin });
      setHasJoined(true);
    }
  }, [emitEvent, searchParams, isConnectedSocket, hasJoined]);

  if (lobbyError.error != '') {
    return <GameLobbyError error={lobbyError} />;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <Triangle
            visible={true}
            height="80"
            width="80"
            color="#2F9966"
            ariaLabel="three-dots-loading"
          />
        </div>
      </>
    );
  }

  if (lobbyState.lobbyId == '') {
    return (
      <GameLobbyError
        error={{
          error: 'Lobby not found',
          message: 'Aucune partie a été trouvée pour cette URL.',
        }}
      />
    );
  }

  if (lobbyState.lobbyId != '') {
    switch (lobbyState.stateLobby) {
      case LOBBY_STATES.IN_LOBBY:
        return <GameLobby lobbyState={lobbyState} />;
      case LOBBY_STATES.GAME_DELETED:
        return <GameLobbyDeleted />;
    }
  }

  return <Game lobbyState={lobbyState} gameState={gameState} />;
}
