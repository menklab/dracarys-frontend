import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";

export interface Program {
  id: number;
  name: string;
  accounts?: Account[];
  instructions?: Instruction[];
}
