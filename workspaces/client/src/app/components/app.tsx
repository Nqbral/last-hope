'use client';

import { SocketProvider } from 'app/context/SocketContext';
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
    <SocketProvider>
      <html className={`${orbitron.className}`}>
        <body>{children}</body>
      </html>
    </SocketProvider>
  );
}
