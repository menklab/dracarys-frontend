import { Position } from "~/interfaces/position";

export interface Account {
  id: number;
  name: string;
  linkedAccounts: number[];
  position?: Position;
  createdAt?: string;
  updatedAt?: string;
}
