import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import LastHopeLogo from '@public/last-hope-logo.png';
import Image from 'next/image';

import LoadingAuth from './layout/LoadingAuth';

export default function Home() {
  return (
    <LoadingAuth>
      <Navbar />
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-6">
        <Image src={LastHopeLogo} alt="last-hope-logo" className="w-64" />
        <div className="flex flex-row gap-12">
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
