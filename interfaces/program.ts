import { Position } from "~/interfaces/position";

export interface Program {
  id: number;
  name: string;
  center?: Position;
  zoom?: number;
  createdAt: string;
  updatedAt: string;
}
