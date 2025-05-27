import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Navbar from '@components/navbar/Navbar';

export default function GameLobbyDeleted() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-primary text-xl sm:text-2xl md:text-4xl">
          Lobby supprimé
        </h1>
        <LinkButton
          buttonText="Retour à la page des lobby"
          linkTo="/lobby"
          typeButton={TypeLinkButton.secondary}
        />
      </div>
    </>
  );
}
