'use client';

import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import { useSocket } from '@contexts/SocketContext';

export default function LobbyReconnectToast() {
  const { isConnectedSocket, lastLobby } = useSocket();

  if (!isConnectedSocket || lastLobby == undefined) {
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
