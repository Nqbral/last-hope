import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import ErrorMessage from '@components/error_message/ErrorMessage';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import LobbyReconnectToast from '@components/toast/LobbyReconnectToast';
import LastHopeLogo from '@public/last-hope-logo.png';
import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Last Hope – Jeu de société post-apocalyptique en ligne',
  description:
    'Découvrez Last Hope, jeu de bluff et de stratégie multijoueur. Sauvez l’humanité ou faites exploser le laboratoire dans ce jeu de bluff à rôles cachés.',
  keywords: [
    'Last Hope',
    'jeu de société',
    'jeu en ligne',
    'post-apocalyptique',
    'bluff',
    'stratégie',
    'multijoueur',
    'docteurs',
    'infectés',
    'remède',
    'explosion',
    'règles',
    'Nqbral Games',
    'Time Bomb',
  ],
  openGraph: {
    title: 'Last Hope – Jeu de société post-apocalyptique en ligne',
    description:
      'Jouez à Last Hope, le jeu de bluff et de stratégie, dans un univers post-apocalyptique. Incarnez un Docteur ou un Infecté, trouvez les remèdes ou faites exploser le laboratoire. Gratuit, multijoueur et sans installation sur Nqbral Games.',
    url: 'https://last-hope.nqbral-games.fr/',
    images: [
      {
        url: 'https://last-hope.nqbral-games.fr/last-hope-logo.png',
        width: 847,
        height: 745,
        alt: 'Logo Last Hope',
      },
    ],
    siteName: 'Last Hope',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Last Hope – Jeu de société post-apocalyptique en ligne',
    description:
      'Jouez à Last Hope, le jeu de bluff et de stratégie, dans un univers post-apocalyptique. Incarnez un Docteur ou un Infecté, trouvez les remèdes ou faites exploser le laboratoire. Gratuit, multijoueur et sans installation sur Nqbral Games.',
    images: ['https://last-hope.nqbral-games.fr/last-hope-logo.png'],
  },
  alternates: {
    canonical: 'https://last-hope.nqbral-games.fr/',
    languages: {
      fr: 'https://last-hope.nqbral-games.fr/',
    },
    types: {},
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Last Hope',
            url: 'https://last-hope.nqbral-games.fr/',
            alternateName: 'Nqbral Games',
            inLanguage: 'fr',
            sameAs: [
              'https://nqbral-games.fr/',
              'https://shadow-network.nqbral-games.fr/',
            ],
          }),
        }}
      />
      <Suspense>
        <Navbar />
      </Suspense>
      <LobbyReconnectToast />
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-6">
        <Image
          src={LastHopeLogo}
          alt="last-hope-logo"
          className="w-32 sm:w-48 md:w-64"
        />
        <h1 className="px-4 text-center text-sm sm:text-lg md:text-xl">
          Last Hope - Jeu de bluff à rôles cachés dans un univers
          post-apocalyptique
        </h1>
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
        <ErrorMessage />
      </div>
      <Footer />
    </>
  );
}
