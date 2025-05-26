import { Card } from "./Card";
import { Player } from "./Player";

export class HistoryEvent {
  public playerInitEvent: Player | null = null;
  public playerTargetEvent: Player | null = null;
  public cardDraw: Card | null = null;
  public roundNumber: number | null = null;

  constructor(public readonly nameEvent: string) {}
}
