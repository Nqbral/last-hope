'use client';

import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import RedButton from '@components/buttons/RedButton';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { useEffect, useState } from 'react';

export default function LobbyReconnectToast() {
  const { isConnectedSocket, lastLobby, emitEvent } = useSocket();
  const [show, setShow] = useState(false);

  const handleLeave = () => emitEvent(CLIENT_EVENTS.LOBBY_LEAVE, undefined);

  useEffect(() => {
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
    <div className="md:text-md fixed right-4 bottom-4 z-50 flex w-72 flex-col items-center rounded border bg-neutral-900 p-4 text-sm shadow-lg sm:w-80">
      <p className="mb-2 text-sm">Vous avez une partie en cours.</p>
      <LinkButton
        buttonText="Revenir"
        linkTo={`/game?lobby=${lastLobby}`}
        typeButton={TypeLinkButton.primary}
      />
      <RedButton buttonText="Quitter" onClick={handleLeave} />
    </div>
  );
}
