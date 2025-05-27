import RoleImage from '@components/images/RoleImage';
import { Player } from '@last-hope/shared/classes/Player';

type Props = {
  player: Player | undefined;
};

export default function RolePlayer({ player }: Props) {
  return (
    <div className="flex w-72 flex-col items-center gap-2 rounded-lg bg-neutral-900 px-2 py-4 text-center">
      {player != undefined && (
        <>
          <div className="text-xs sm:text-sm md:text-base">
            Vous êtes un{' '}
            <span className={`text-${player.role?.color}`}>
              {player.role?.nameRole}
            </span>
            .
          </div>
          <RoleImage role={player.role} />
          <div className="text-xs sm:text-sm md:text-base">
            {player.role?.goal}
          </div>
        </>
      )}
    </div>
  );
}
