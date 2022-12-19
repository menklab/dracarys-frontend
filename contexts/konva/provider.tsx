import Konva from "konva";
import absoluteUrl from "next-absolute-url";
import { useRef } from "react";
import updateAccount from "~/adapters/account/updateAccount";
import { Connection } from "~/interfaces/connection";
import { calculatePointsForConnection, getAccountGroupId, getConnectionId } from "~/utils/konva";
import { KonvaContext } from "./context";
import { KonvaContextActions, KonvaProviderProps } from "./types";

export default function KonvaProvider({ accounts, children }: KonvaProviderProps) {
  const stageRef = useRef<Konva.Stage>(null);

  const actions: KonvaContextActions = {
    redraw: () => stageRef.current?.draw(),
    findNode: (nodeId) => stageRef.current?.findOne(`#${nodeId}`),
    saveAccountPosition: async (accountId, dragTo, cancelDragCb) => {
      const { origin } = absoluteUrl();
      const res = await updateAccount(origin, { accountId, newPosition: dragTo });
      if (!res.ok) {
        // TODO: show error
        cancelDragCb();
        actions.repositionArrows(accountId);
      }
    },
    repositionArrows: (movedAccountId: number) => {
      const account = accounts.find((account) => account.id === movedAccountId);
      if (!account) return;

      const connectionsFromAccount: Connection[] = account.accounts?.map((to) => ({ from: account.id, to })) || [];
      const connectionsToAccount: Connection[] = accounts.reduce(
        (prev: { from: number; to: number }[], curr) =>
          curr.accounts?.includes(account.id) ? [...prev, { from: curr.id, to: account.id }] : prev,
        []
      );

      const relatedConnections = [...connectionsFromAccount, ...connectionsToAccount];
      for (const relatedConnection of relatedConnections) {
        const { from, to } = relatedConnection;
        const connection = actions.findNode<Konva.Arrow>(getConnectionId(from, to));
        if (!connection) return;

        const accountGroupFrom = actions.findNode<Konva.Group>(getAccountGroupId(from))?.getClientRect();
        const accountGroupTo = actions.findNode<Konva.Group>(getAccountGroupId(to))?.getClientRect();
        if (!accountGroupFrom || !accountGroupTo) return;

        const points = calculatePointsForConnection(accountGroupFrom, accountGroupTo);
        connection.points(points);
      }

      actions.redraw();
    },
  };

  return <KonvaContext.Provider value={{ actions, data: { accounts, stageRef } }}>{children}</KonvaContext.Provider>;
}
