'use client';

import { AuthProvider } from '@contexts/AuthContext';
import { SocketProvider } from '@contexts/SocketContext';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
});
export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SocketProvider>
        <html className={`${orbitron.className}`}>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#1A1A1A" />
          <script
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
          <body>{children}</body>
        </html>
      </SocketProvider>
    </AuthProvider>
  );
}
