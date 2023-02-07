import { Attribute } from "~/interfaces/attribute";
import { Position } from "~/interfaces/position";

export interface Account {
  id: number;
  name: string;
  attributes?: Attribute[];
  linkedAccounts: number[];
  position?: Position;
  createdAt?: string;
  updatedAt?: string;
}
