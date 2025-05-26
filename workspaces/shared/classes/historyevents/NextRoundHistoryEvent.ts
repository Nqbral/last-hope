import { HISTORY_EVENTS } from "../../consts/HistoryEvents";
import { HistoryEvent } from "../HistoryEvent";

export class NextRoundHistoryEvent extends HistoryEvent {
  constructor(roundNumber: number) {
    super(HISTORY_EVENTS.NEXT_ROUND);
    this.roundNumber = roundNumber;
  }
}
