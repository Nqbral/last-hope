import { Role } from "../Role";

export class Doctor extends Role {
  constructor(nbRemediesToFind: number) {
    super("Docteur", "testimage", "emerald-400");

    this.goal = `Vous devez trouvez ${nbRemediesToFind} remèdes avant que les infectés fassent exploser le laboratoire.`;
  }
}
