import { NAME_ROLE } from "../../consts/NameRole";
import { Role } from "../Role";

export class InfectedRole extends Role {
  constructor(nbRemediesToFind: number) {
    super(NAME_ROLE.INFECTED, "red-400");

    this.goal = `Vous devez exploser le laboratoire avant que les docteurs trouvent les ${nbRemediesToFind} remèdes.`;
  }
}
