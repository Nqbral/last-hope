import { NAME_CARD } from "../consts/NameCard";
import { Card } from "./Card";
import { Role } from "./Role";

export class Player {
  public color: string = "";
  public role: Role | undefined = undefined;
  public ready: boolean = false;
  public hand: Card[] = [];

  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public disconnected: boolean = false
  ) {}

  public orderCards(): void {
    this.hand = this.hand.sort((a, b) => {
      if (
        a.nameCard == NAME_CARD.BOMB ||
        (a.nameCard == NAME_CARD.REMEDY && b.nameCard == NAME_CARD.NEUTRAL)
      ) {
        return -1;
      }

      if (
        b.nameCard == NAME_CARD.BOMB ||
        (b.nameCard == NAME_CARD.REMEDY && a.nameCard == NAME_CARD.NEUTRAL)
      ) {
        return 1;
      }

      return 0;
    });
  }
}
