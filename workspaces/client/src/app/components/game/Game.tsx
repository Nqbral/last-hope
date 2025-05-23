import ModalPauseDisconnect from '@components/modal/ModalPauseDisconnect';
import { LOBBY_STATES } from '@last-hope/shared/consts/LobbyStates';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Modal } from '@mui/material';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function Game({ lobbyState }: Props) {
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

      <div className="flex min-h-screen flex-col items-center justify-center">
        IN GAME
        {lobbyState?.stateLobby == LOBBY_STATES.GAME_PAUSED && (
          <div>EN PAUSE</div>
        )}
      </div>
    </>
  );
}
