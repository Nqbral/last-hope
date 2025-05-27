import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Navbar from '@components/navbar/Navbar';
import LobbyReconnectToast from '@components/toast/LobbyReconnectToast';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';

type Props = {
  error: ServerPayloads[ServerEvents.LobbyError] | null;
};

export default function GameLobbyError({ error }: Props) {
  return (
    <>
      <Navbar />
      <LobbyReconnectToast />
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-primary text-xl sm:text-2xl md:text-4xl">
          Erreur !
        </h1>
        <p className="text-center text-sm sm:text-base">{error?.message}</p>
        <LinkButton
          buttonText="Retour à la page des lobby"
          linkTo="/lobby"
          typeButton={TypeLinkButton.secondary}
        />
      </div>
    </>
  );
}
