'use client';

import { useAuth } from '@contexts/AuthContext';
import { Triangle } from 'react-loader-spinner';

import Footer from './footer/Footer';
import Navbar from './navbar/Navbar';

export default function IsPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, isLogged } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#2F9966"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-amber-400">Vous devez être connecté pour jouer !</p>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
