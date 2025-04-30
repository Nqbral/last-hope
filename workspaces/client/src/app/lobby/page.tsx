'use client';

import LinkButton from '@components/buttons/LinkButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { useAuth } from '@contexts/AuthContext';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from 'app/types/ClientEvents';

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
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-row gap-12">
        <PrimaryButton buttonText="Créer un lobby" onClick={createLobby} />
        <LinkButton buttonText={'Retour'} linkTo={'/'} primary={false} />
      </div>
    </div>
  );
}
