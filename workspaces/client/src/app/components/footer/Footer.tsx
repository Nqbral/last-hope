import NqbralGamesLogo from '@public/nqbral-games-logo.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="fixed bottom-0 flex w-full flex-row items-center justify-center px-6 py-4 shadow-sm">
      <Link href={`${process.env.NEXT_PUBLIC_WS_NQBRAL_GAMES_URL}`}>
        <Image src={NqbralGamesLogo} className="w-20" alt="nqbral-games-logo" />
      </Link>
    </div>
  );
}
