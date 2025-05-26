import PrimaryButton from '@components/buttons/PrimaryButton';
import RoleImage from '@components/images/RoleImage';
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

export default function ModalRoleDistribution({ player, gameState }: Props) {
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
          Distribution des rôles
        </h2>
        {player != undefined && (
          <>
            <div>
              Vous êtes un{' '}
              <span className={`text-${player.role?.color}`}>
                {player.role?.nameRole}
              </span>
              .
            </div>
            <RoleImage role={player.role} />
            <div>{player.role?.goal}</div>
          </>
        )}
        <div>En attente de :</div>
        <div>
          {playersNotReady.map((playersNotReady, index) => {
            if (index == 0) {
              return (
                <span
                  key={`player-not-ready-${playersNotReady.userId}`}
                  className={`text-${playersNotReady.color}`}
                >
                  {playersNotReady.userName}
                </span>
              );
            }

            return (
              <>
                {', '}
                <span
                  key={`player-not-ready-${playersNotReady.userId}`}
                  className={`text-${playersNotReady.color}`}
                >
                  {playersNotReady.userName}
                </span>
              </>
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
