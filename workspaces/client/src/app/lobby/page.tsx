import LobbyClient from 'app/clients/LobbyClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lobby - Last Hope',
  description:
    'Créez un lobby ou rejoignez celui de vos amis pour débuter une partie de Last Hope, le jeu de bluff dans un univers post-apocalyptique. Invitez, organisez et lancez vos parties facilement.',
  robots: 'noindex, nofollow',
};

export default function LobbyPage() {
  return <LobbyClient />;
}
