import Konva from "konva";
import { useRef } from "react";
import updateAccount from "~/adapters/account/updateAccount";
import updateAccountLinks from "~/adapters/account/updateAccountLinks";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Connection } from "~/interfaces/connection";
import { calculatePointsForConnection, getAccountGroupId, getConnectionId } from "~/utils/konva";
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
        const newLinks = [{ accountId: fromAccountId, linkedAccounts: [toAccountId] }];
        const oldLinks = accounts.reduce(
          (prev: any[], curr) =>
            curr.linkedAccounts.length > 0
              ? [...prev, { accountId: curr.id, linkedAccounts: curr.linkedAccounts }]
              : prev,
          []
        );
        await updateAccountLinks({ links: [...oldLinks, ...newLinks] });
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    reverseConnection: async (fromAccountId, toAccountId) => {
      try {
        const newLinks = [
          { accountId: fromAccountId, linkedAccounts: [] },
          { accountId: toAccountId, linkedAccounts: [fromAccountId] },
        ];

        const oldLinks: any[] = [];
        for (const account of accounts) {
          if (
            !(
              [fromAccountId, toAccountId].includes(account.id) ||
              account.linkedAccounts.includes(fromAccountId) ||
              account.linkedAccounts.includes(toAccountId)
            )
          )
            oldLinks.push({ accountId: account.id, linkedAccounts: account.linkedAccounts });
        }

        await updateAccountLinks({ links: [...oldLinks, ...newLinks] });
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
      }
    },
    deleteConnection: async (fromAccountId, toAccountId) => {
      try {
        const links = accounts.reduce(
          (prev: any[], curr) =>
            curr.linkedAccounts.length > 0
              ? [...prev, { accountId: curr.id, linkedAccounts: [...curr.linkedAccounts] }]
              : prev,
          []
        );

        const idx = links.findIndex(
          (link) => link.accountId === fromAccountId && link.linkedAccounts.includes(toAccountId)
        );

        links[idx].linkedAccounts = [];

        await updateAccountLinks({ links });
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
        (prev: { from: number; to: number }[], curr) =>
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
