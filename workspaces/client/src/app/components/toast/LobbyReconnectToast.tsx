'use client';

import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import { useSocket } from '@contexts/SocketContext';
import { useEffect, useState } from 'react';

export default function LobbyReconnectToast() {
  const { isConnectedSocket, lastLobby } = useSocket();
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log('Modification toast');
    console.log(lastLobby);
    if (isConnectedSocket && lastLobby != undefined) {
      setShow(true);
      return;
    }

    setShow(false);
  }, [isConnectedSocket, lastLobby]);

  if (!show) {
    return <></>;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-80 flex-col items-center rounded border p-4 shadow-lg">
      <p className="mb-2 text-sm">Vous avez une partie en cours.</p>
      <LinkButton
        buttonText="Revenir"
        linkTo={`/game?lobby=${lastLobby}`}
        typeButton={TypeLinkButton.primary}
      />
    </div>
  );
}
