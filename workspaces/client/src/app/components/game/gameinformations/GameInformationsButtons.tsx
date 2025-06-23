import RedButton from '@components/buttons/RedButton';
import ModalLeaveGame from '@components/modal/ModalLeaveGame';
import { Modal } from '@mui/material';
import { useState } from 'react';

export default function GameInformationsButtons() {
  const [openLobbyLeave, setOpenLobbyLeave] = useState(false);
  const handleOpenLobbyLeave = () => setOpenLobbyLeave(true);
  const handleCloseLobbyLeave = () => setOpenLobbyLeave(false);

  return (
    <div className="flex w-72 flex-col items-center gap-2 rounded-lg bg-neutral-900 px-2 py-4 text-center text-base shadow-sm shadow-neutral-950 sm:text-lg md:text-2xl">
      <Modal
        open={openLobbyLeave}
        onClose={handleCloseLobbyLeave}
        aria-labelledby="modal-lobby-leave"
        aria-describedby="modal-lobby-leave"
      >
        <ModalLeaveGame handleClose={handleCloseLobbyLeave} />
      </Modal>

      <RedButton
        buttonText="Quitter la partie"
        onClick={handleOpenLobbyLeave}
      />
    </div>
  );
}
