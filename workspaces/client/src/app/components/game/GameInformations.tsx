import { Player } from '@last-hope/shared/classes/Player';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';

import GameInformationsButtons from './gameinformations/GameInformationsButtons';
import HistoryChat from './gameinformations/HistoryChat';
import RolePlayer from './gameinformations/RolePlayer';

type Props = {
  player: Player | undefined;
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function GameInformations({ player, gameState }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center gap-2 pb-8">
      <HistoryChat gameState={gameState} />
      <RolePlayer player={player} />
      <GameInformationsButtons />
    </div>
  );
}
