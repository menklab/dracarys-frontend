import { AccountType } from "~/enums/instructionElementTypes";

export interface InstructionElement {
  id: number;
  name: string;
  order: number;
  description: string;
  mut: boolean;
  accountType: AccountType;
  genericType: string;
  createdAt?: string;
  updatedAt?: string;
}
