'use client';

import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import Footer from '@components/footer/Footer';
import HeadDescription from '@components/head/HeadDescription';
import ModalJoinLobby from '@components/modal/ModalJoinLobby';
import Navbar from '@components/navbar/Navbar';
import CustomNotification from '@components/notifications/CustomNotification';
import LobbyReconnectToast from '@components/toast/LobbyReconnectToast';
import { useAuth } from '@contexts/AuthContext';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Listener } from '@lib/SocketManager';
import { Modal } from '@mui/material';
import LoadingAuth from 'app/layout/LoadingAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const { isLogged } = useAuth();
  const {
    isConnectedSocket,
    lastLobby,
    addListener,
    removeListener,
    emitEvent,
  } = useSocket();
  const router = useRouter();
  const [openLobbyJoin, setOpenLobbyJoin] = useState(false);
  const handleOpenLobbyJoin = () => setOpenLobbyJoin(true);
  const handleCloseLobbyJoin = () => setOpenLobbyJoin(false);

  const createLobby = () => {
    if (!isLogged) {
      toast(CustomNotification, {
        data: {
          title: 'Erreur',
          content: 'Vous devez être connecté pour créer un lobby.',
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 300,
        },
      });
      return;
    }

    if (lastLobby) {
      toast(CustomNotification, {
        data: {
          title: 'Erreur',
          content:
            'Vous êtes déjà dans une partie. Vous ne pouvez pas créer un lobby.',
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 300,
        },
      });
      return;
    }

    emitEvent(CLIENT_EVENTS.LOBBY_CREATE, undefined);
  };

  useEffect(() => {
    if (!isConnectedSocket) {
      return;
    }

    const onLobbyCreate: Listener<ServerPayloads[ServerEvents.LobbyCreate]> = (
      data,
    ) => {
      router.push('/game?lobby=' + data.lobbyId);
    };

    addListener(ServerEvents.LobbyCreate, onLobbyCreate);

    return () => {
      removeListener(ServerEvents.LobbyCreate, onLobbyCreate);
    };
  }, [isConnectedSocket, addListener, removeListener, router]);

  return (
    <>
      <HeadDescription />
      <LoadingAuth>
        <Navbar />
        <LobbyReconnectToast />
        <ToastContainer transition={Slide} />
        <Modal
          open={openLobbyJoin}
          onClose={handleCloseLobbyJoin}
          aria-labelledby="modal-lobby-join"
          aria-describedby="modal-lobby-join"
        >
          <ModalJoinLobby handleClose={handleCloseLobbyJoin} />
        </Modal>
        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-2 sm:gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-12">
            <PrimaryButton buttonText="Créer un lobby" onClick={createLobby} />
            <SecondaryButton
              buttonText="Rejoindre un lobby"
              onClick={handleOpenLobbyJoin}
            />
          </div>
          <LinkButton
            buttonText={'Retour'}
            linkTo={'/'}
            typeButton={TypeLinkButton.tertiary}
          />
          {!isLogged && (
            <p className="text-amber-400">
              Vous devez être connecté pour jouer !
            </p>
          )}
          <Footer />
        </div>
      </LoadingAuth>
    </>
  );
}
