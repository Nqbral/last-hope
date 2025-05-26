import { NAME_ROLE } from "../../consts/NameRole";
import { Role } from "../Role";

export class DoctorRole extends Role {
  constructor(nbRemediesToFind: number) {
    super(NAME_ROLE.DOCTOR, "emerald-400");

    this.goal = `Vous devez trouvez ${nbRemediesToFind} remèdes avant que les infectés fassent exploser le laboratoire.`;
  }
}
