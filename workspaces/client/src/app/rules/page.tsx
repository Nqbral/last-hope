import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Navbar from '@components/navbar/Navbar';
import LoadingAuth from 'app/layout/LoadingAuth';

export default function RulesPage() {
  return (
    <LoadingAuth>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center gap-6 pt-24">
        <h1 className="text-primary text-4xl">Règles</h1>
        <LinkButton
          buttonText="Retour"
          linkTo="/"
          typeButton={TypeLinkButton.secondary}
        />
      </div>
    </LoadingAuth>
  );
}
