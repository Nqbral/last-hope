import ModalCheckingCards from '@components/modal/ModalCheckingCards';
import ModalCheckingOtherPlayerCards from '@components/modal/ModalCheckingOtherPlayerCards';
import ModalFinishedByLeaving from '@components/modal/ModalFinishedByLeaving';
import ModalOtherPlayerCardDraw from '@components/modal/ModalOtherPlayerCardDraw';
import ModalPauseDisconnect from '@components/modal/ModalPauseDisconnect';
import ModalRecapRound from '@components/modal/ModalRecapRound';
import ModalRoleDistribution from '@components/modal/ModalRoleDistribution';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { GAME_STATES } from '@last-hope/shared/consts/GameStates';
import { LOBBY_STATES } from '@last-hope/shared/consts/LobbyStates';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { Slide, ToastContainer } from 'react-toastify';

import DrawedCardsRound from './DrawedCardRound';
import FoundRemedies from './FoundRemedies';
import GameInformations from './GameInformations';
import PlayersDisplay from './PlayersDisplay';
import RoundInformations from './RoundInformations';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function Game({ lobbyState, gameState }: Props) {
  const { userId } = useSocket();
  const [myPlayer, setPlayer] = useState<Player | undefined>(undefined);

  useEffect(() => {
    if (gameState != null) {
      setPlayer(
        gameState.players.find((player) => {
          return player.userId == userId;
        }),
      );
    }
  }, [gameState, userId]);

  return (
    <>
      {/* Modals */}
      <Modal
        open={lobbyState?.stateLobby == LOBBY_STATES.GAME_PAUSED}
        onClose={() => {}}
        aria-labelledby="modal-disconnected-pause"
        aria-describedby="modal-disconnected-pause"
      >
        <ModalPauseDisconnect lobbyState={lobbyState} />
      </Modal>

      <Modal
        open={lobbyState?.stateLobby == LOBBY_STATES.GAME_FINISHED_BY_LEAVING}
        onClose={() => {}}
        aria-labelledby="modal-finished-by-leaving"
        aria-describedby="modal-finished-by-leaving"
      >
        <ModalFinishedByLeaving lobbyState={lobbyState} />
      </Modal>

      <Modal
        open={
          lobbyState?.stateLobby != LOBBY_STATES.GAME_PAUSED &&
          lobbyState?.stateLobby != LOBBY_STATES.GAME_FINISHED_BY_LEAVING &&
          gameState?.stateGame == GAME_STATES.ROLE_DISTRIBUTION
        }
        onClose={() => {}}
        aria-labelledby="modal-role-distribution"
        aria-describedby="modal-role-distribution"
      >
        <ModalRoleDistribution player={myPlayer} gameState={gameState} />
      </Modal>

      <Modal
        open={
          lobbyState?.stateLobby != LOBBY_STATES.GAME_PAUSED &&
          lobbyState?.stateLobby != LOBBY_STATES.GAME_FINISHED_BY_LEAVING &&
          gameState?.stateGame == GAME_STATES.CHECKING_CARDS
        }
        onClose={() => {}}
        aria-labelledby="modal-checking-cards"
        aria-describedby="modal-checking-cards"
      >
        <ModalCheckingCards player={myPlayer} gameState={gameState} />
      </Modal>

      <Modal
        open={
          lobbyState?.stateLobby != LOBBY_STATES.GAME_PAUSED &&
          lobbyState?.stateLobby != LOBBY_STATES.GAME_FINISHED_BY_LEAVING &&
          gameState?.stateGame == GAME_STATES.CHECKING_OTHER_PLAYER_CARDS
        }
        onClose={() => {}}
        aria-labelledby="modal-checking-other-cards"
        aria-describedby="modal-checking-other-cards"
      >
        <ModalCheckingOtherPlayerCards
          player={myPlayer}
          gameState={gameState}
        />
      </Modal>

      <Modal
        open={
          lobbyState?.stateLobby != LOBBY_STATES.GAME_PAUSED &&
          lobbyState?.stateLobby != LOBBY_STATES.GAME_FINISHED_BY_LEAVING &&
          gameState?.stateGame == GAME_STATES.OTHER_PLAYER_CARD_DRAW
        }
        onClose={() => {}}
        aria-labelledby="modal-other-player-card-draw"
        aria-describedby="modal-other-player-card-draw"
      >
        <ModalOtherPlayerCardDraw gameState={gameState} />
      </Modal>

      <Modal
        open={
          lobbyState?.stateLobby != LOBBY_STATES.GAME_PAUSED &&
          lobbyState?.stateLobby != LOBBY_STATES.GAME_FINISHED_BY_LEAVING &&
          gameState?.stateGame == GAME_STATES.RECAP_ROUND
        }
        onClose={() => {}}
        aria-labelledby="modal-recap-round"
        aria-describedby="modal-recap-round"
      >
        <ModalRecapRound player={myPlayer} gameState={gameState} />
      </Modal>

      {/* TOAST CONTAINER */}
      <ToastContainer transition={Slide} />

      {/* GAME */}
      <div className="flex min-h-screen w-full flex-row pt-20">
        <GameInformations player={myPlayer} gameState={gameState} />
        <div className="flex w-full flex-col items-center gap-8">
          <RoundInformations gameState={gameState} player={myPlayer} />
          <PlayersDisplay gameState={gameState} myPlayer={myPlayer} />
          <DrawedCardsRound gameState={gameState} />
          <FoundRemedies gameState={gameState} />
        </div>
      </div>
    </>
  );
}
