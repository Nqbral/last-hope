import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function FoundRemedies({ gameState }: Props) {
  return (
    <div className="text-xl">
      Remède(s) trouvé(s) :{' '}
      <span className="text-emerald-400">{gameState?.remediesFound}</span>
    </div>
  );
}
