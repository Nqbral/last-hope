import LinkButton from '@components/buttons/LinkButton';

import LoadingAuth from './layout/LoadingAuth';

export default function Home() {
  return (
    <LoadingAuth>
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
        <div className="flex flex-row gap-12">
          <LinkButton buttonText={'Jouer'} linkTo={'lobby'} primary={true} />
          <LinkButton buttonText={'Règles'} linkTo={'rules'} primary={false} />
        </div>
      </div>
    </LoadingAuth>
  );
}
