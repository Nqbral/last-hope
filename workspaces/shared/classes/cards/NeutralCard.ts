import { NAME_CARD } from "../../consts/NameCard";
import { Card } from "../Card";

export class NeutralCard extends Card {
  constructor() {
    super(NAME_CARD.NEUTRAL, "neutral-400");
  }
}
