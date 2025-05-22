'use client';

import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import { useAuth } from '@contexts/AuthContext';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { Listener } from '@lib/SocketManager';
import LoadingAuth from 'app/layout/LoadingAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isLogged } = useAuth();
  const { isConnectedSocket, addListener, removeListener, emitEvent } =
    useSocket();
  const router = useRouter();

  const createLobby = () => {
    if (!isLogged) {
      console.log('Doit etre loggué');
      return;
    }

    emitEvent(CLIENT_EVENTS.LOBBY_CREATE, undefined);
  };

  useEffect(() => {
    if (!isConnectedSocket) {
      return;
    }

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      router.push('/game?lobby=' + data.lobbyId);
    };

    addListener(ServerEvents.LobbyState, onLobbyState);

    return () => {
      removeListener(ServerEvents.LobbyState, onLobbyState);
    };
  }, [isConnectedSocket, addListener, removeListener, router]);

  return (
    <LoadingAuth>
      <Navbar />
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
        <div className="flex flex-row gap-12">
          <PrimaryButton buttonText="Créer un lobby" onClick={createLobby} />
          <SecondaryButton
            buttonText="Rejoindre un lobby"
            onClick={createLobby}
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
  );
}
