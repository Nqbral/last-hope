import IsPrivate from '@components/IsPrivate';
import GameManager from '@components/game/GameManager';
import HeadDescription from '@components/head/HeadDescription';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Jeu - Shadow Network',
  description:
    "Participez à une partie de Last Hope, le jeu de bluff dans un univers post-apocalyptique. Affrontez vos amis, élaborez vos stratégies et tentez de sauvez l'humanité ou la menez à sa perte.",
  robots: 'noindex, nofollow',
};

export default function GamePage() {
  return (
    <>
      <HeadDescription />
      <IsPrivate>
        <Suspense>
          <GameManager />
        </Suspense>
      </IsPrivate>
    </>
  );
}
