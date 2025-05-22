import IsPrivate from '@components/IsPrivate';
import GameManager from '@components/game/GameManager';
import { Suspense } from 'react';

export default function GamePage() {
  return (
    <IsPrivate>
      <Suspense>
        <GameManager />
      </Suspense>
    </IsPrivate>
  );
}
