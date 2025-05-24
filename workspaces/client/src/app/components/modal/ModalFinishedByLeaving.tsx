import PrimaryButton from '@components/buttons/PrimaryButton';
import RedButton from '@components/buttons/RedButton';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useRouter } from 'next/navigation';

import ModalTemplate from './ModalTemplate';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function ModalFinishedByLeaving({ lobbyState }: Props) {
  const { userId, emitEvent } = useSocket();
  const isOwner = userId === lobbyState?.ownerId;
  const router = useRouter();

  const handleLeave = () => {
    emitEvent(CLIENT_EVENTS.LOBBY_LEAVE, undefined);
    router.push('/');
  };
  const handleDelete = () => emitEvent(CLIENT_EVENTS.LOBBY_DELETE, undefined);

  return (
    <ModalTemplate>
      <div className="flex w-xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Partie terminée</h2>
        <div>
          Un joueur a quitté la partie, la partie se termine prématurément.
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <PrimaryButton buttonText="Quitter la partie" onClick={handleLeave} />
          {isOwner && (
            <RedButton buttonText="Supprimer le lobby" onClick={handleDelete} />
          )}
        </div>
      </div>
    </ModalTemplate>
  );
}
