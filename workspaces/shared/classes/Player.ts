import { Role } from "./Role";

export class Player {
  public color: string = "";
  public role: Role | undefined = undefined;
  public ready: boolean = false;

  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public disconnected: boolean = false
  ) {}
}
