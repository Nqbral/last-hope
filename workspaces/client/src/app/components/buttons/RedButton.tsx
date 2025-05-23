import { MouseEventHandler } from 'react';

type Props = {
  buttonText: string;
  onClick: MouseEventHandler | undefined;
};

export default function RedButton({ buttonText, onClick }: Props) {
  return (
    <button
      className="button my-1 min-w-48 rounded-md border-2 border-red-400 px-6 py-2 transition-colors hover:border-red-500"
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}
