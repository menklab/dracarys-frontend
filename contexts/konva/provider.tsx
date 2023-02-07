import Konva from "konva";
import { useRef } from "react";
import updateAccount from "~/adapters/account/updateAccount";
import updateAccountLinks from "~/adapters/account/updateAccountLinks";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Connection } from "~/interfaces/connection";
import {
  calculatePointsForConnection,
  getAccountGroupId,
  getConnectionId,
  getUnrelatedConnections,
} from "~/utils/konva";
import { KonvaContext } from "./context";
import { KonvaContextActions, KonvaProviderProps } from "./types";

export default function KonvaProvider({ program, accounts, children }: KonvaProviderProps) {
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();
  const stageRef = useRef<Konva.Stage>(null);

  const actions: KonvaContextActions = {
    redraw: () => stageRef.current?.draw(),
    findNode: (nodeId) => stageRef.current?.findOne(`#${nodeId}`),
    saveAccountPosition: async (accountId, dragTo, cancelDragCb) => {
      try {
        await updateAccount(accountId, { coordinates: dragTo });
      } catch (e) {
        displayCaughtError(e);
        cancelDragCb();
        actions.repositionArrows(accountId);
      }
    },
    createConnection: async (fromAccountId, toAccountId) => {
      try {
        const accountFrom = accounts.find((account) => account.id === fromAccountId);
        const accountTo = accounts.find((account) => account.id === toAccountId);
        if (!accountFrom || !accountTo) return;

        if (
          accounts.find((account) => account.id === toAccountId && account.linkedAccounts.includes(fromAccountId)) ||
          accounts.find((account) => account.id === fromAccountId && account.linkedAccounts.includes(toAccountId))
        )
          return;

        const connections: Connection[] = [
          { from: fromAccountId, to: toAccountId },
          ...accountFrom.linkedAccounts.map((to) => ({ from: fromAccountId, to })),
          ...getUnrelatedConnections(accounts, fromAccountId, toAccountId),
        ];

        await updateAccountLinks(connections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    changeConnectionTo: async (fromAccountId, oldToAccountId, newToAccountId) => {
      try {
        const accountFrom = accounts.find((account) => account.id === fromAccountId);
        const accountToOld = accounts.find((account) => account.id === oldToAccountId);
        if (!accountFrom || !accountToOld) return;

        const connections: Partial<Connection>[] = [
          { from: fromAccountId, to: newToAccountId },
          ...accountFrom.linkedAccounts.map((to) => ({
            from: fromAccountId,
            to: to === oldToAccountId ? undefined : to,
          })),
          ...getUnrelatedConnections(accounts, fromAccountId, oldToAccountId),
        ];

        await updateAccountLinks(connections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    changeConnectionFrom: async (oldFromAccountId, newFromAccountId, toAccountId) => {
      try {
        const oldAccountFrom = accounts.find((account) => account.id === oldFromAccountId);
        const newAccountFrom = accounts.find((account) => account.id === newFromAccountId);
        if (!oldAccountFrom || !newAccountFrom) return;

        const connections: Partial<Connection>[] = [
          { from: newFromAccountId, to: toAccountId },
          ...newAccountFrom.linkedAccounts.map((to) => ({ from: newFromAccountId, to })),
          ...oldAccountFrom.linkedAccounts.map((to) => ({
            from: oldFromAccountId,
            to: to === toAccountId ? undefined : to,
          })),
          ...getUnrelatedConnections(accounts, oldFromAccountId, toAccountId),
        ];

        await updateAccountLinks(connections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    reverseConnection: async (fromAccountId, toAccountId) => {
      try {
        const accountFrom = accounts.find((account) => account.id === fromAccountId);
        const accountTo = accounts.find((account) => account.id === toAccountId);
        if (!accountFrom || !accountTo) return;

        const connections: Partial<Connection>[] = [
          { from: toAccountId, to: fromAccountId },
          ...accountTo.linkedAccounts.map((to) => ({ from: toAccountId, to })),
          ...accountFrom.linkedAccounts.map((to) => ({ from: fromAccountId, to: to === toAccountId ? undefined : to })),
          ...getUnrelatedConnections(accounts, fromAccountId, toAccountId),
        ];

        await updateAccountLinks(connections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    deleteConnection: async (fromAccountId, toAccountId) => {
      try {
        const connections: Partial<Connection>[] = accounts.reduce((prev: Partial<Connection>[], curr) => {
          if (curr.linkedAccounts.length === 0) return prev;
          if (curr.id === fromAccountId && curr.linkedAccounts.includes(toAccountId))
            return [
              ...prev,
              ...curr.linkedAccounts.map((to) => ({ from: curr.id, to: to === toAccountId ? undefined : to })),
            ];
          return [...prev, ...curr.linkedAccounts.map((to) => ({ from: curr.id, to }))];
        }, []);

        await updateAccountLinks(connections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    repositionArrows: (movedAccountId: number) => {
      const account = accounts.find((account) => account.id === movedAccountId);
      if (!account) return;

      const connectionsFromAccount: Connection[] = account.linkedAccounts.map((to) => ({ from: account.id, to })) || [];
      const connectionsToAccount: Connection[] = accounts.reduce(
        (prev: Connection[], curr) =>
          curr.linkedAccounts.includes(account.id) ? [...prev, { from: curr.id, to: account.id }] : prev,
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

  return (
    <KonvaContext.Provider value={{ actions, data: { program, accounts, stageRef } }}>{children}</KonvaContext.Provider>
  );
}
