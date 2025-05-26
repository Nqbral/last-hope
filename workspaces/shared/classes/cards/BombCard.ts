import { NAME_CARD } from "../../consts/NameCard";
import { Card } from "../Card";

export class BombCard extends Card {
  constructor() {
    super(NAME_CARD.BOMB, "orange-400");
  }
}
