import CopyInviteLinkButton from '@components/buttons/CopyInviteLinkButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import RedButton from '@components/buttons/RedButton';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function GameLobby({ lobbyState }: Props) {
  const { userId, emitEvent } = useSocket();
  const router = useRouter();
  const [errMsgName, setErrMsgName] = useState('');

  const isOwner = userId === lobbyState?.ownerId;

  const handleStart = () => {
    if (lobbyState?.players != undefined) {
      if (lobbyState.players.length < 4) {
        setErrMsgName("Il n'y a pas assez de joueurs pour lancer la partie.");
        return;
      }

      if (lobbyState.players.length > 8) {
        setErrMsgName('Il y a trop de joueurs pour lancer la partie.');
        return;
      }
    }

    emitEvent(CLIENT_EVENTS.LOBBY_START_GAME, undefined);
  };
  const handleDelete = () => emitEvent(CLIENT_EVENTS.LOBBY_DELETE, undefined);
  const handleLeave = () => {
    emitEvent(CLIENT_EVENTS.LOBBY_LEAVE, undefined);
    router.push('/lobby');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-sm sm:text-base">
      <p className="italic">Nombre de joueurs minimum requis : 4</p>
      <p className="italic">Nombre de joueurs maximum : 8</p>
      <div className="flex w-80 flex-col items-center justify-center gap-2 border-1 border-slate-700 py-4 sm:w-100">
        <h2 className="mb-2 text-base sm:text-lg">Liste des joueurs</h2>
        {lobbyState?.players.map((player, index) => {
          return (
            <div key={`player_${index}`}>
              {index + 1}.{' '}
              <span className={`text-${player.color}`}>{player.userName}</span>
            </div>
          );
        })}
      </div>
      <p
        className={errMsgName ? 'text-center text-red-600' : 'hidden'}
        aria-live="assertive"
      >
        {errMsgName}
      </p>
      {isOwner ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <PrimaryButton
              buttonText="Lancer la partie"
              onClick={handleStart}
            />
            <CopyInviteLinkButton />
          </div>

          <RedButton buttonText="Supprimer le lobby" onClick={handleDelete} />
        </div>
      ) : (
        <div className="flex flex-row items-center gap-3">
          <CopyInviteLinkButton />
          <RedButton buttonText="Quitter le lobby" onClick={handleLeave} />
        </div>
      )}
    </div>
  );
}
