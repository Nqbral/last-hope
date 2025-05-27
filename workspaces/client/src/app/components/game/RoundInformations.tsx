import { Player } from '@last-hope/shared/classes/Player';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useEffect, useState } from 'react';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
  player: Player | undefined;
};

export default function RoundInformations({ gameState, player }: Props) {
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  useEffect(() => {
    if (gameState?.playerTurn?.userId == player?.userId) {
      setIsPlayerTurn(true);
      return;
    }

    setIsPlayerTurn(false);
  }, [gameState, player]);
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="text-lg sm:text-xl md:text-2xl">
        Manche {gameState?.roundNumber}
      </div>
      {isPlayerTurn ? (
        <div>À votre tour de jouer</div>
      ) : (
        <div>
          Au tour de{' '}
          <span className={`text-${gameState?.playerTurn?.color}`}>
            {gameState?.playerTurn?.userName}
          </span>{' '}
          de jouer
        </div>
      )}
    </div>
  );
}
