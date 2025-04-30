'use client';

import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import { useAuth } from '@contexts/AuthContext';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import LoadingAuth from 'app/layout/LoadingAuth';

export default function Home() {
  const { isLogged } = useAuth();
  const socket = useSocket();

  const createLobby = () => {
    if (!isLogged) {
      console.log('Doit etre loggué');
      return;
    }

    socket.emitEvent(CLIENT_EVENTS.LOBBY_CREATE, undefined);
  };

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
