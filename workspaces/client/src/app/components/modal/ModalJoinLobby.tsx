import SecondaryButton from '@components/buttons/SecondaryButton';

import ModalTemplate from './ModalTemplate';

type Props = {
  handleClose: () => void;
};

export default function ModalJoinLobby({ handleClose }: Props) {
  return (
    <ModalTemplate>
      <div className="flex flex-col items-center gap-2 text-center sm:gap-3 md:gap-6">
        <h2 className="text-secondary-hover pb-2 text-lg sm:text-2xl">
          Rejoindre un lobby
        </h2>
        <p className="text-xs sm:text-sm md:text-base">
          Pour rejoindre un lobby, il suffit de copier/coller le lien donner par
          le créateur du lobby dans le navigateur
        </p>
        <SecondaryButton buttonText="Retour" onClick={handleClose} />
      </div>
    </ModalTemplate>
  );
}
