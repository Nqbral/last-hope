import { MouseEventHandler } from 'react';

type Props = {
  buttonText: string;
  onClick: MouseEventHandler | undefined;
};

export default function PrimaryButton({ buttonText, onClick }: Props) {
  return (
    <button
      className="button border-primary hover:border-primary-hover my-1 min-w-48 rounded-md border-2 px-6 py-2 text-xs transition-colors sm:text-sm md:text-base"
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}
