import { Attribute } from "~/interfaces/attribute";
import { Position } from "~/interfaces/position";

export interface Account {
  id: number;
  name: string;
  attributes?: Attribute[];
  accounts?: number[];
  position?: Position;
  createdAt?: string;
  updatedAt?: string;
}
