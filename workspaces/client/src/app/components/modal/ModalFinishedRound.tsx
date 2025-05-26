import PrimaryButton from '@components/buttons/PrimaryButton';
import RedButton from '@components/buttons/RedButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import RoleImage from '@components/images/RoleImage';
import { useSocket } from '@contexts/SocketContext';
import { Player } from '@last-hope/shared/classes/Player';
import { CLIENT_EVENTS } from '@last-hope/shared/consts/ClientEvents';
import { GAME_FINISH_STATUSES } from '@last-hope/shared/consts/GameFinishStatuses';
import { NAME_ROLE } from '@last-hope/shared/consts/NameRole';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ModalTemplate from './ModalTemplate';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function ModalFinishedRound({ lobbyState, gameState }: Props) {
  const { userId, emitEvent } = useSocket();
  const isOwner = userId === lobbyState?.ownerId;
  const router = useRouter();
  const [listInfected, setListInfected] = useState<Player[]>([]);
  const [listDoctors, setListDoctors] = useState<Player[]>([]);

  useEffect(() => {
    if (gameState != null) {
      setListDoctors(
        gameState.players.filter(
          (player) => player.role?.nameRole == NAME_ROLE.DOCTOR,
        ),
      );
      setListInfected(
        gameState.players.filter(
          (player) => player.role?.nameRole == NAME_ROLE.INFECTED,
        ),
      );
    }
  }, [gameState]);

  const handleStart = () => {
    emitEvent(CLIENT_EVENTS.LOBBY_START_GAME, undefined);
  };

  const handleLeave = () => {
    emitEvent(CLIENT_EVENTS.LOBBY_LEAVE, undefined);
    router.push('/');
  };
  const handleDelete = () => emitEvent(CLIENT_EVENTS.LOBBY_DELETE, undefined);

  return (
    <ModalTemplate>
      <div className="flex w-xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Partie terminée</h2>
        {gameState?.statusFinish == GAME_FINISH_STATUSES.DOCTORS_WIN && (
          <div>
            Les <span className="text-emerald-400">Docteurs</span> ont gagné en
            développant le remède.
          </div>
        )}
        {gameState?.statusFinish ==
          GAME_FINISH_STATUSES.INFECTED_WIN_BY_BOMB && (
          <div>
            Les <span className="text-red-400">Infectés</span> ont gagné en
            faisant exploser le laboratoire rapidement.
          </div>
        )}
        {gameState?.statusFinish ==
          GAME_FINISH_STATUSES.INFECTED_WIN_BY_TIME && (
          <div>
            Les <span className="text-red-400">Infectés</span> ont gagné car les{' '}
            <span className="text-emerald-400">Docteurs</span> n&apos;ont pas
            réussi à développer le remède à temps.
          </div>
        )}

        <h3 className="text-xl text-emerald-400">Docteurs</h3>
        <div className="flex flex-row items-center gap-2">
          {listDoctors.map((player, index) => {
            return (
              <div
                key={`doctor-player-${index}`}
                className="flex flex-col items-center gap-2"
              >
                <RoleImage role={player.role} />
                <div className={`text-${player.color}`}>{player.userName}</div>
              </div>
            );
          })}
        </div>

        <h3 className="text-xl text-red-400">Infectés</h3>
        <div className="flex flex-row items-center gap-2">
          {listInfected.map((player, index) => {
            return (
              <div
                key={`infected-player-${index}`}
                className="flex flex-col items-center gap-2"
              >
                <RoleImage role={player.role} />
                <div className={`text-${player.color}`}>{player.userName}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-row items-center justify-center gap-3">
          {isOwner ? (
            <>
              <PrimaryButton
                buttonText="Démarrer une autre manche"
                onClick={handleStart}
              />
              <RedButton
                buttonText="Supprimer le lobby"
                onClick={handleDelete}
              />
            </>
          ) : (
            <SecondaryButton
              buttonText="Quitter la partie"
              onClick={handleLeave}
            />
          )}
        </div>
      </div>
    </ModalTemplate>
  );
}
