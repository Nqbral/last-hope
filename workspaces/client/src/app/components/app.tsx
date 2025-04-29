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
          <body>{children}</body>
        </html>
      </SocketProvider>
    </AuthProvider>
  );
}
