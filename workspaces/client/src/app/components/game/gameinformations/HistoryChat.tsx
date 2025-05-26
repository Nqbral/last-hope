import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function HistoryChat({ gameState }: Props) {
  const items: string[] = [
    'Nqbral a récupéré un remède chez Poune',
    'Chat 2',
    'Chat 1',
    'Chat 2',
    'Chat 1',
    'Chat 2',
    'Chat 1',
    'Chat 2',
    'Chat 1',
    'Chat 2',
    'Chat 1',
    'Chat 2',
    'Chat 1',
    'Chat 2',
  ];

  return (
    <div className="flex h-[400px] w-72 flex-col overflow-hidden rounded-lg bg-neutral-900">
      <div className="px-4 pt-4 font-bold">Historique de la partie</div>
      <hr className="my-2" />
      <ul className="custom-scrollbar h-full overflow-y-auto text-sm">
        {items.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 odd:bg-neutral-900 even:bg-neutral-950"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
