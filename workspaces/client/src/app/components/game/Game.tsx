import ModalCheckingCards from '@components/modal/ModalCheckingCards';
import ModalFinishedByLeaving from '@components/modal/ModalFinishedByLeaving';
import ModalPauseDisconnect from '@components/modal/ModalPauseDisconnect';
import ModalRoleDistribution from '@components/modal/ModalRoleDistribution';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { GAME_STATES } from '@last-hope/shared/consts/GameStates';
import { LOBBY_STATES } from '@last-hope/shared/consts/LobbyStates';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';

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
        aria-labelledby="modal-role-distribution"
        aria-describedby="modal-role-distribution"
      >
        <ModalCheckingCards player={myPlayer} gameState={gameState} />
      </Modal>

      <div className="flex min-h-screen flex-col items-center justify-center">
        IN GAME
        {lobbyState?.stateLobby == LOBBY_STATES.GAME_PAUSED && (
          <div>EN PAUSE</div>
        )}
      </div>
    </>
  );
}
