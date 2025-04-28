'use client';

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
    <html className={`${orbitron.className}`}>
      <body>{children}</body>
    </html>
  );
}
