import LinkButton from '@components/buttons/LinkButton';

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-row gap-12">
        <LinkButton buttonText={'Retour'} linkTo={'/'} primary={true} />
      </div>
    </div>
  );
}
