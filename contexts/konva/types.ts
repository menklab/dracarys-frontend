import Konva from "konva";
import { ReactNode, RefObject } from "react";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";
import { Position } from "~/interfaces/position";
import { Program } from "~/interfaces/program";

export interface KonvaContextActions {
  findNode: <S extends Konva.Node>(nodeId: string) => S | undefined;
  resetStageAppearance: (cancelCb: () => void) => Promise<void>;
  updateStagePosition: (position: Position, cancelCb: () => void) => Promise<void>;
  updateStageScale: (position: Position, zoom: number) => Promise<void>;
  updateAccountPosition: (accountId: number, dragTo: Position, cancelCb: () => void) => Promise<void>;
  createConnection: (fromAccountId: number, toAccountId: number) => Promise<void>;
  updateConnectionFrom: (oldFromAccountId: number, newFromAccountId: number, toAccountId: number) => Promise<void>;
  updateConnectionTo: (fromAccountId: number, oldToAccountId: number, newToAccountId: number) => Promise<void>;
  updateConnectionReverse: (fromAccountId: number, toAccountId: number) => Promise<void>;
  deleteConnection: (fromAccountId: number, toAccountId: number) => Promise<void>;
  redrawConnections: (movedAccountId: number) => void;
}

export interface KonvaContextData {
  isLoading: boolean;
  program: Program;
  accounts: Account[];
  connections: Connection[];
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
