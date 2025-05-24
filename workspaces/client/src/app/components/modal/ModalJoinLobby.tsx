import SecondaryButton from '@components/buttons/SecondaryButton';

import ModalTemplate from './ModalTemplate';

type Props = {
  handleClose: () => void;
};

export default function ModalJoinLobby({ handleClose }: Props) {
  return (
    <ModalTemplate>
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">
          Rejoindre un lobby
        </h2>
        <p>
          Pour rejoindre un lobby, il suffit de copier/coller le lien donner par
          le créateur du lobby dans le navigateur
        </p>
        <SecondaryButton buttonText="Retour" onClick={handleClose} />
      </div>
    </ModalTemplate>
  );
}
