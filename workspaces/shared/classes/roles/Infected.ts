import { Role } from "../Role";

export class Infected extends Role {
  constructor(nbRemediesToFind: number) {
    super("Infecté", "testimage", "red-400");

    this.goal = `Vous devez exploser le laboratoire avant que les docteurs trouvent les ${nbRemediesToFind} remèdes.`;
  }
}
