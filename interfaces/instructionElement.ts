import { AccountType } from "~/enums/instructionElementTypes";
import { GenericCustomSubType, GenericSubType } from "~/interfaces/genericType";

export interface InstructionElement {
  id: number;
  name: string;
  order: number;
  description: string;
  mut: boolean;
  accountType: AccountType;
  genericType: GenericSubType | GenericCustomSubType;
  createdAt?: string;
  updatedAt?: string;
}
