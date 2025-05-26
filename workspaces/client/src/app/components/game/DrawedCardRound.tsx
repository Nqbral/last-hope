import CardImage from '@components/images/CardImage';
import { Card } from '@last-hope/shared/classes/Card';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useEffect, useState } from 'react';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function DrawedCardsRound({ gameState }: Props) {
  const [drawedCardRounds, setDrawedCardsRounds] = useState<Card[]>([]);

  useEffect(() => {
    if (gameState != null) {
      setDrawedCardsRounds(gameState.cardsDisplayedRound);
    }
  }, [gameState]);

  return (
    <div className="border-sm flex h-[250px] min-w-3xl flex-col items-center gap-4 border-1 border-neutral-800 py-4">
      <div className="text-xl">Carte(s) neutralisée(s) dans la manche</div>
      <div className="flex flex-row items-center gap-3">
        {drawedCardRounds.map((card, index) => {
          return (
            <CardImage
              key={`drawed-card-round-${index}`}
              card={card}
              showText={true}
            />
          );
        })}
      </div>
    </div>
  );
}
