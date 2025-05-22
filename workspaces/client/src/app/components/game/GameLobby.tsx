import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ServerPayloads } from '@last-hope/shared/types/ServerPayloads';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function GameLobby({ lobbyState }: Props) {
  console.log(lobbyState);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <p className="italic">Nombre de joueurs minimum requis : 4</p>
      <p className="italic">Nombre de joueurs maximum : 8</p>
      <div className="flex w-100 flex-col items-center justify-center gap-2 border-1 border-slate-700 py-4">
        <h2 className="mb-2 text-lg">Liste des joueurs</h2>
        {lobbyState?.players.map((player, index) => {
          return (
            <div key={`player_lobby_${index}`}>
              {index + 1}.{' '}
              <span className={`text-${player.color}`}>{player.userName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
