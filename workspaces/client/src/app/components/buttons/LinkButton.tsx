import Link from 'next/link';

export enum TypeLinkButton {
  primary,
  secondary,
  tertiary,
}

type Props = {
  buttonText: string;
  linkTo: string;
  typeButton: TypeLinkButton;
};

export default function LinkButton({ linkTo, buttonText, typeButton }: Props) {
  return (
    <Link href={linkTo}>
      {typeButton == TypeLinkButton.primary && (
        <button className="button border-primary hover:border-primary-hover my-1 min-w-48 rounded-md border-2 px-6 py-2 text-xs transition-colors sm:text-sm md:text-base">
          {buttonText}
        </button>
      )}
      {typeButton == TypeLinkButton.secondary && (
        <button className="button border-secondary hover:border-secondary-hover my-1 min-w-48 rounded-md border-2 px-6 py-2 text-xs transition-colors sm:text-sm md:text-base">
          {buttonText}
        </button>
      )}
      {typeButton == TypeLinkButton.tertiary && (
        <button className="button border-tertiary hover:border-tertiary-hover my-1 min-w-48 rounded-md border-2 px-6 py-2 text-xs transition-colors sm:text-sm md:text-base">
          {buttonText}
        </button>
      )}
    </Link>
  );
}
