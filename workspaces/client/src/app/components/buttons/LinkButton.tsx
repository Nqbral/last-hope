import Link from 'next/link';

type Props = {
  buttonText: string;
  linkTo: string;
  primary: boolean;
};

export default function LinkButton({ linkTo, buttonText, primary }: Props) {
  return (
    <Link href={linkTo}>
      {primary ? (
        <button className="button border-primary hover:border-primary-hover my-1 min-w-48 rounded-md border-2 px-6 py-2 transition-colors">
          {buttonText}
        </button>
      ) : (
        <button className="button border-secondary hover:border-secondary-hover my-1 min-w-48 rounded-md border-2 px-6 py-2 transition-colors">
          {buttonText}
        </button>
      )}
    </Link>
  );
}
