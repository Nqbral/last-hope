import RedButton from '@components/buttons/RedButton';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useEffect, useState } from 'react';

import ModalTemplate from './ModalTemplate';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function ModalPauseDisconnect({ lobbyState }: Props) {
  const { userId, emitEvent } = useSocket();
  const [playersDisconnected, setPlayersDisconnected] = useState<Player[]>([]);
  const isOwner = userId === lobbyState?.ownerId;

  const handleDelete = () => emitEvent(CLIENT_EVENTS.LOBBY_DELETE, undefined);

  useEffect(() => {
    if (lobbyState != null) {
      setPlayersDisconnected(lobbyState.players.filter((p) => p.disconnected));
    }
  }, [lobbyState]);

  return (
    <ModalTemplate>
      <div className="flex w-xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Jeu en pause</h2>
        <div>En attente de la reconnexion de :</div>
        <div>
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
        {isOwner && (
          <RedButton buttonText="Supprimer le lobby" onClick={handleDelete} />
        )}
      </div>
    </ModalTemplate>
  );
}
