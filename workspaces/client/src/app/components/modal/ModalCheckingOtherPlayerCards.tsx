import SecondaryButton from '@components/buttons/SecondaryButton';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import BackCard from '@public/backcard.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import ModalTemplate from './ModalTemplate';

type Props = {
  player: Player | undefined;
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function ModalCheckingOtherPlayerCards({
  player,
  gameState,
}: Props) {
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isPlayerCheckedOurself, setIsPlayerCheckedOurself] = useState(false);
  const { emitEvent, userId } = useSocket();

  useEffect(() => {
    if (gameState?.playerTurn?.userId == player?.userId) {
      setIsPlayerTurn(true);
      return;
    }

    setIsPlayerTurn(false);
  }, [gameState, player]);

  useEffect(() => {
    if (gameState?.checkedPlayerHand?.userId == userId) {
      setIsPlayerCheckedOurself(true);
      return;
    }

    setIsPlayerCheckedOurself(false);
  }, [gameState, userId]);

  const backToPlayerTurn = () => {
    emitEvent(CLIENT_EVENTS.BACK_TO_PLAYER_TURN, undefined);
  };

  const selectCardToDraw = (indexCardToDraw: number) => {
    emitEvent(CLIENT_EVENTS.DRAW_OTHER_PLAYER_CARD, {
      indexCardDraw: indexCardToDraw,
    });
  };

  return (
    <ModalTemplate>
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Neutralisation</h2>
        {isPlayerTurn ? (
          <div className="flex flex-col gap-1">
            <div>
              Vous regardez la main de{' '}
              <span className={`text-${gameState?.checkedPlayerHand?.color}`}>
                {gameState?.checkedPlayerHand?.userName}
              </span>
              .
            </div>
            <div>
              Veuillez sélectionner la carte que vous voulez neutraliser.
            </div>
          </div>
        ) : (
          <div>
            <span className={`text-${gameState?.playerTurn?.color}`}>
              {gameState?.playerTurn?.userName}
            </span>{' '}
            {isPlayerCheckedOurself ? (
              <div className="inline-block"> regarde votre main.</div>
            ) : (
              <div className="inline-block">
                regarde la main de{' '}
                <span className={`text-${gameState?.checkedPlayerHand?.color}`}>
                  {gameState?.checkedPlayerHand?.userName}
                </span>
                .
              </div>
            )}
          </div>
        )}
        <div className="flex flex-row items-center gap-2">
          {isPlayerTurn
            ? gameState?.checkedPlayerHand?.hand.map((card, index) => {
                return (
                  <Image
                    src={BackCard}
                    alt={`backcard-player-checked-${index}`}
                    key={`backcard-player-checked-${index}`}
                    className="w-24 transition-transform hover:scale-105"
                    onClick={() => {
                      selectCardToDraw(index);
                    }}
                  />
                );
              })
            : gameState?.checkedPlayerHand?.hand.map((card, index) => {
                return (
                  <Image
                    src={BackCard}
                    alt={`backcard-player-checked-${index}`}
                    key={`backcard-player-checked-${index}`}
                    className="w-24"
                  />
                );
              })}
        </div>
        {isPlayerTurn && (
          <SecondaryButton buttonText="Retour" onClick={backToPlayerTurn} />
        )}
      </div>
    </ModalTemplate>
  );
}
