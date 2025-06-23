import RedButton from '@components/buttons/RedButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import { useSocket } from '@contexts/SocketContext';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { useRouter } from 'next/navigation';

import ModalTemplate from './ModalTemplate';

type Props = {
  handleClose: () => void;
};

export default function ModalLeaveGame({ handleClose }: Props) {
  const { emitEvent } = useSocket();
  const router = useRouter();

  const onLeave = () => {
    emitEvent(CLIENT_EVENTS.LOBBY_LEAVE, undefined);
    router.push('/');
  };

  return (
    <ModalTemplate>
      <div className="flex flex-col items-center gap-2 text-center sm:gap-3 md:gap-6">
        <h2 className="text-secondary-hover pb-2 text-lg sm:text-2xl">
          Quitter la partie
        </h2>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <RedButton buttonText="Quitter la partie" onClick={onLeave} />
          <SecondaryButton buttonText="Retour" onClick={handleClose} />
        </div>
      </div>
    </ModalTemplate>
  );
}
