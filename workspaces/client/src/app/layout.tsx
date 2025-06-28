import App from '@components/app';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Last Hope by Nqbral Games',
  description: 'Jeu de stratégie en ligne avec zombies et trahison',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
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
      <App>{children}</App>
    </>
  );
}
