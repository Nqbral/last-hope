import { HISTORY_EVENTS } from "../../consts/HistoryEvents";
import { Card } from "../Card";
import { HistoryEvent } from "../HistoryEvent";
import { Player } from "../Player";

export class PickCardHistoryEvent extends HistoryEvent {
  constructor(
    playerInitEvent: Player,
    playerTargetEvent: Player,
    cardDraw: Card
  ) {
    super(HISTORY_EVENTS.PICK_CARD);
    this.playerInitEvent = playerInitEvent;
    this.playerTargetEvent = playerTargetEvent;
    this.cardDraw = cardDraw;
  }
}
