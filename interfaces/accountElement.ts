import { ElementType } from "~/enums/elementType";

export interface AccountElement {
  id: number;
  name: string;
  type: ElementType;
  createdAt?: string;
  updatedAt?: string;
}
