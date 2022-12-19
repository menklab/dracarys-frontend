import Konva from "konva";
import { ReactNode, Ref } from "react";
import { Account } from "~/interfaces/account";
import { Position } from "~/interfaces/position";

export interface KonvaContextActions {
  redraw: () => void;
  findNode: <S extends Konva.Node>(nodeId: string) => S | undefined;
  saveAccountPosition: (accountId: number, dragTo: Position, cancelDragCb: () => void) => Promise<void>;
  repositionArrows: (movedAccountId: number) => void;
}

export interface KonvaContextData {
  accounts: Account[];
  stageRef: Ref<Konva.Stage>;
}

export interface KonvaContextDefaultValue {
  actions: KonvaContextActions;
  data: KonvaContextData;
}

export interface KonvaProviderProps {
  accounts: Account[];
  children: ReactNode;
}
