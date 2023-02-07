import Konva from "konva";
import { ReactNode, RefObject } from "react";
import { Account } from "~/interfaces/account";
import { Position } from "~/interfaces/position";
import { Program } from "~/interfaces/program";

export interface KonvaContextActions {
  redraw: () => void;
  findNode: <S extends Konva.Node>(nodeId: string) => S | undefined;
  saveAccountPosition: (accountId: number, dragTo: Position, cancelDragCb: () => void) => Promise<void>;
  createConnection: (fromAccountId: number, toAccountId: number) => Promise<void>;
  changeConnectionTo: (fromAccountId: number, oldToAccountId: number, newToAccountId: number) => Promise<void>;
  changeConnectionFrom: (oldFromAccountId: number, newFromAccountId: number, toAccountId: number) => Promise<void>;
  reverseConnection: (fromAccountId: number, toAccountId: number) => Promise<void>;
  deleteConnection: (fromAccountId: number, toAccountId: number) => Promise<void>;
  repositionArrows: (movedAccountId: number) => void;
}

export interface KonvaContextData {
  program: Program;
  accounts: Account[];
  stageRef: RefObject<Konva.Stage>;
}

export interface KonvaContextDefaultValue {
  actions: KonvaContextActions;
  data: KonvaContextData;
}

export interface KonvaProviderProps {
  program: Program;
  accounts: Account[];
  children: ReactNode;
}
