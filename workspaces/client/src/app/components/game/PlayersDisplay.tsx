import { Player } from '@last-hope/shared/classes/Player';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useEffect, useState } from 'react';

import PlayerDisplay from './player/PlayerDisplay';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
  myPlayer: Player | undefined;
};

export default function PlayersDisplay({ gameState, myPlayer }: Props) {
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  useEffect(() => {
    if (gameState?.playerTurn?.userId == myPlayer?.userId) {
      setIsPlayerTurn(true);
      return;
    }

    setIsPlayerTurn(false);
  }, [gameState, myPlayer]);

  return (
    <div className="flex w-full flex-row flex-wrap justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6">
      {gameState?.players.map((player, index) => {
        return (
          <PlayerDisplay
            key={`player-display-${index}`}
            player={player}
            myPlayer={myPlayer}
            isPlayerTurn={isPlayerTurn}
          />
        );
      })}
    </div>
  );
}
