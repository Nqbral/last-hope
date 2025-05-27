import { HistoryEvent } from '@last-hope/shared/classes/HistoryEvent';
import { HISTORY_EVENTS } from '@last-hope/shared/consts/HistoryEvents';

type Props = {
  event: HistoryEvent;
};

export default function HistoryChatListTile({ event }: Props) {
  switch (event.nameEvent) {
    case HISTORY_EVENTS.NEXT_ROUND:
      return (
        <li className="px-4 py-2 text-xs font-bold odd:bg-neutral-900 even:bg-neutral-950 sm:text-sm md:text-base">
          Passage à la manche {event.roundNumber}.
        </li>
      );
    case HISTORY_EVENTS.PICK_CARD:
      return (
        <li className="px-4 py-2 text-xs odd:bg-neutral-900 even:bg-neutral-950 sm:text-sm md:text-base">
          <span className={`text-${event.playerInitEvent?.color}`}>
            {event.playerInitEvent?.userName}
          </span>{' '}
          a tiré la carte{' '}
          <span className={`text-${event.cardDraw?.color}`}>
            {event.cardDraw?.nameCard}
          </span>{' '}
          chez{' '}
          <span className={`text-${event.playerTargetEvent?.color}`}>
            {event.playerTargetEvent?.userName}
          </span>
          .
        </li>
      );
  }
}
