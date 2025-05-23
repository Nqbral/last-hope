import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Navbar from '@components/navbar/Navbar';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';

type Props = {
  error: ServerPayloads[ServerEvents.LobbyError] | null;
};

export default function GameLobbyError({ error }: Props) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-primary text-4xl">Erreur !</h1>
        <p>{error?.message}</p>
        <LinkButton
          buttonText="Retour à la page des lobby"
          linkTo="/lobby"
          typeButton={TypeLinkButton.secondary}
        />
      </div>
    </>
  );
}
