'use client';

import { useAuth } from '@contexts/AuthContext';
import NqbralGamesLogo from '@public/nqbral-games-logo-row.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isLogged, userName } = useAuth();
  const router = useRouter();

  const toLogin = () => {
    router.push(
      process.env.NEXT_PUBLIC_WS_NQBRAL_GAMES_URL +
        '/signin?redirect_to=' +
        process.env.NEXT_PUBLIC_WS_LAST_HOPE_URL,
    );
  };

  return (
    <div className="fixed top-0 flex w-full flex-row items-center justify-between bg-neutral-900 px-6 py-4 shadow-sm shadow-neutral-950">
      <Link href="/">
        <div>Logo</div>
        {/* <Image src={NqbralGamesLogo} className="w-20" alt="nqbral-games-logo" /> */}
      </Link>
      {isLogged == null && <></>}
      {isLogged == true && (
        <div>
          <Link
            href={`${process.env.NEXT_PUBLIC_WS_NQBRAL_GAMES_URL}/profile/informations`}
            className="transition-colors hover:text-neutral-300"
            target="_blank"
          >
            {userName}
          </Link>
        </div>
      )}
      {isLogged == false && (
        <button
          className="transition-colors hover:text-neutral-300"
          onClick={toLogin}
        >
          Se connecter
        </button>
      )}
    </div>
  );
}
