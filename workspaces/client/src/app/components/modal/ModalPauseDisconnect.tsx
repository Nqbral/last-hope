import RedButton from '@components/buttons/RedButton';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ModalTemplate from './ModalTemplate';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function ModalPauseDisconnect({ lobbyState }: Props) {
  const { userId, emitEvent } = useSocket();
  const [playersDisconnected, setPlayersDisconnected] = useState<Player[]>([]);
  const isOwner = userId === lobbyState?.ownerId;
  const router = useRouter();

  const handleDelete = () => emitEvent(CLIENT_EVENTS.LOBBY_DELETE, undefined);
  const handleLeave = () => {
    emitEvent(CLIENT_EVENTS.LOBBY_LEAVE, undefined);
    router.push('/lobby');
  };

  useEffect(() => {
    if (lobbyState != null) {
      setPlayersDisconnected(lobbyState.players.filter((p) => p.disconnected));
    }
  }, [lobbyState]);

  return (
    <ModalTemplate>
      <div className="flex flex-col items-center gap-2 text-center sm:gap-3 md:gap-6">
        <h2 className="text-secondary-hover pb-2 text-lg sm:text-2xl">
          Jeu en pause
        </h2>
        <div className="text-xs sm:text-sm md:text-base">
          En attente de la reconnexion de :
        </div>
        <div className="text-xs sm:text-sm md:text-base">
          {playersDisconnected.map((playerDisconnected, index) => {
            if (index == 0) {
              return (
                <div
                  key={`player-disconnected-${playerDisconnected.userId}`}
                  className="inline-block"
                >
                  <span className={`text-${playerDisconnected.color}`}>
                    {playerDisconnected.userName}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={`player-disconnected-${playerDisconnected.userId}`}
                className="inline-block"
              >
                {', '}
                <span className={`text-${playerDisconnected.color}`}>
                  {playerDisconnected.userName}
                </span>
              </div>
            );
          })}
        </div>
        {isOwner ? (
          <RedButton buttonText="Supprimer le lobby" onClick={handleDelete} />
        ) : (
          <RedButton buttonText="Quitter le lobby" onClick={handleLeave} />
        )}
      </div>
    </ModalTemplate>
  );
}
