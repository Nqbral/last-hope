import { HistoryEvent } from '@last-hope/shared/classes/HistoryEvent';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';
import { useEffect, useState } from 'react';

import HistoryChatListTile from './HistoryChatListTile';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function HistoryChat({ gameState }: Props) {
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    if (gameState != null) {
      setHistoryEvents(gameState.historyEvents);
    }
  }, [gameState]);

  return (
    <div className="flex h-[400px] w-72 flex-col overflow-hidden rounded-lg bg-neutral-900">
      <div className="px-4 pt-4 font-bold">Historique de la partie</div>
      <hr className="my-2" />
      <ul className="custom-scrollbar h-full overflow-y-auto text-sm">
        {historyEvents.map((historyEvent, index) => (
          <HistoryChatListTile
            event={historyEvent}
            key={`history-event-${index}`}
          />
        ))}
      </ul>
    </div>
  );
}
