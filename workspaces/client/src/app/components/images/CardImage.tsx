import { Card } from '@last-hope/shared/classes/Card';
import { NAME_CARD } from '@last-hope/shared/consts/NameCard';
import Bomb from '@public/bomb.png';
import NeutralImg from '@public/neutral.png';
import RemedyImg from '@public/remedy.png';
import Image from 'next/image';

type Props = {
  card: Card | undefined;
  showText: boolean;
};

export default function CardImage({ card, showText }: Props) {
  if (card?.nameCard == NAME_CARD.BOMB) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Image src={Bomb} alt="bomb_img" className="w-24 min-w-24" />
        {showText && <div>{card.nameCard}</div>}
      </div>
    );
  }

  if (card?.nameCard == NAME_CARD.NEUTRAL) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Image src={NeutralImg} alt="neutral_img" className="w-24 min-w-24" />
        {showText && <div>{card.nameCard}</div>}
      </div>
    );
  }

  if (card?.nameCard == NAME_CARD.REMEDY) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Image src={RemedyImg} alt="remedy_img" className="w-24 min-w-24" />
        {showText && <div>{card.nameCard}</div>}
      </div>
    );
  }

  return <></>;
}
