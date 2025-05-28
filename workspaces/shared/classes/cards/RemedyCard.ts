import { NAME_CARD } from "../../consts/NameCard";
import { Card } from "../Card";

export class RemedyCard extends Card {
  constructor() {
    super(NAME_CARD.REMEDY, "blue-400");
  }
}
