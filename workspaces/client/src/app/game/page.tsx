import IsPrivate from '@components/IsPrivate';
import GameManager from '@components/game/GameManager';
import HeadDescription from '@components/head/HeadDescription';
import { Suspense } from 'react';

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
