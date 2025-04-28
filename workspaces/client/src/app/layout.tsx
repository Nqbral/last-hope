import App from '@components/app';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Last Hope',
  description: 'Last Hope - online game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <App>{children}</App>;
}
