import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import LobbyReconnectToast from '@components/toast/LobbyReconnectToast';
import LastHopeLogo from '@public/last-hope-logo.png';
import Image from 'next/image';

import LoadingAuth from './layout/LoadingAuth';

export default function Home() {
  return (
    <LoadingAuth>
      <Navbar />
      <LobbyReconnectToast />
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-6">
        <Image
          src={LastHopeLogo}
          alt="last-hope-logo"
          className="w-32 sm:w-48 md:w-64"
        />
        <div className="flex flex-col gap-1 md:flex-row md:gap-12">
          <LinkButton
            buttonText={'Jouer'}
            linkTo={'lobby'}
            typeButton={TypeLinkButton.primary}
          />
          <LinkButton
            buttonText={'Règles'}
            linkTo={'rules'}
            typeButton={TypeLinkButton.secondary}
          />
        </div>
      </div>
      <Footer />
    </LoadingAuth>
  );
}
