import PrimaryButton from '@components/buttons/PrimaryButton';
import CardImage from '@components/images/CardImage';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useEffect, useState } from 'react';
import { Triangle } from 'react-loader-spinner';

import ModalTemplate from './ModalTemplate';

type Props = {
  player: Player | undefined;
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function ModalRecapRound({ player, gameState }: Props) {
  const [playersNotReady, setPlayersNotReady] = useState<Player[]>([]);
  const { emitEvent } = useSocket();

  const handleReady = () => {
    emitEvent(CLIENT_EVENTS.GAME_READY, undefined);
  };

  useEffect(() => {
    if (gameState != null) {
      setPlayersNotReady(gameState.players.filter((p) => !p.ready));
    }
  }, [gameState]);

  return (
    <ModalTemplate>
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">
          Récapitulatif de la manche{' '}
          {gameState?.roundNumber && gameState.roundNumber - 1}
        </h2>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row items-center justify-center gap-2">
            {gameState?.cardsDisplayedRound.map((card, index) => {
              return (
                <CardImage
                  key={`card-recap-round-${index}`}
                  card={card}
                  showText={true}
                />
              );
            })}
          </div>
        </div>

        <div>En attente de :</div>
        <div>
          {playersNotReady.map((playersNotReady, index) => {
            if (index == 0) {
              return (
                <div
                  className="inline-block"
                  key={`player-not-ready-${playersNotReady.userId}`}
                >
                  <span className={`text-${playersNotReady.color}`}>
                    {playersNotReady.userName}
                  </span>
                </div>
              );
            }

            return (
              <div
                className="inline-block"
                key={`player-not-ready-${playersNotReady.userId}`}
              >
                {', '}
                <span className={`text-${playersNotReady.color}`}>
                  {playersNotReady.userName}
                </span>
              </div>
            );
          })}
        </div>
        {player?.ready ? (
          <Triangle
            visible={true}
            height="40"
            width="40"
            color="#2F9966"
            ariaLabel="three-dots-loading"
          />
        ) : (
          <PrimaryButton buttonText="Prêt à jouer" onClick={handleReady} />
        )}
      </div>
    </ModalTemplate>
  );
}
