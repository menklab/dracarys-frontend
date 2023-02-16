import Konva from "konva";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import updateAccount from "~/adapters/account/updateAccount";
import updateAccountLinks from "~/adapters/account/updateAccountLinks";
import updateProgram from "~/adapters/program/updateProgram";
import { KONVA_DEFAULT_STAGE_POSITION, KONVA_DEFAULT_STAGE_SCALE } from "~/constants/konva";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Connection } from "~/interfaces/connection";
import {
  calculatePointsForConnection,
  getAccountGroupId,
  getConnectionId,
  getConnectionsFromAccounts,
  moveConnectionRelativeToStage,
} from "~/utils/konva";
import { KonvaContext } from "./context";
import { KonvaContextActions, KonvaProviderProps } from "./types";

export default function KonvaProvider({ program, accounts, children }: KonvaProviderProps) {
  const [connections, setConnections] = useState<Connection[]>(getConnectionsFromAccounts(accounts));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const stageRef = useRef<Konva.Stage>(null);
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();
  const router = useRouter();

  useEffect(() => {
    const confirmationMessage = "Changes you made may not be saved.";
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    };
    const beforeRouteHandler = (url: string) => {
      if (router.asPath !== url && !confirm(confirmationMessage)) {
        router.events.emit("routeChangeError");
        throw `Route change to "${url}" was aborted.`;
      }
    };
    if (isLoading) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      router.events.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    };
  }, [isLoading, router.asPath, router.events]);

  const actions: KonvaContextActions = {
    findNode: (nodeId) => stageRef.current?.findOne(`#${nodeId}`),
    resetStageAppearance: async (cancelCb) => {
      try {
        setIsLoading(true);
        await updateProgram(program.id, {
          name: program.name,
          center: KONVA_DEFAULT_STAGE_POSITION,
          zoom: KONVA_DEFAULT_STAGE_SCALE,
        });
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        cancelCb();
      } finally {
        setIsLoading(false);
      }
    },
    updateStagePosition: async (position, cancelCb) => {
      try {
        setIsLoading(true);
        await updateProgram(program.id, { name: program.name, center: position, zoom: program.zoom });
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        cancelCb();
      } finally {
        setIsLoading(false);
      }
    },
    updateStageScale: async (position, zoom) => {
      try {
        setIsLoading(true);
        await updateProgram(program.id, { name: program.name, center: position, zoom });
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        await triggerSSR();
      } finally {
        setIsLoading(false);
      }
    },
    updateAccountPosition: async (accountId, dragTo, cancelCb) => {
      try {
        setIsLoading(true);
        await updateAccount(accountId, { coordinates: dragTo });
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        cancelCb();
        actions.redrawConnections(accountId);
      } finally {
        setIsLoading(false);
      }
    },
    createConnection: async (fromAccountId, toAccountId) => {
      const oldConnections = [...connections];
      try {
        setIsLoading(true);
        if (
          connections.find((c) => c.from === toAccountId && c.to === fromAccountId) ||
          connections.find((c) => c.from === fromAccountId && c.to === toAccountId)
        )
          return;
        const newConnections = [...connections, { from: fromAccountId, to: toAccountId }];
        setConnections(newConnections);
        await updateAccountLinks(newConnections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        setConnections(oldConnections);
      } finally {
        setIsLoading(false);
      }
    },
    updateConnectionFrom: async (oldFromAccountId, newFromAccountId, toAccountId) => {
      const oldConnections = [...connections];
      try {
        setIsLoading(true);
        const newConnections: Partial<Connection>[] = connections.reduce(
          (prev: Partial<Connection>[], curr) =>
            curr.from === oldFromAccountId && curr.to === toAccountId
              ? [...prev, { from: curr.from }]
              : [...prev, { ...curr }],
          [{ from: newFromAccountId, to: toAccountId }]
        );
        setConnections(newConnections.filter((c) => c.to !== undefined) as Connection[]);
        await updateAccountLinks(newConnections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        setConnections(oldConnections);
      } finally {
        setIsLoading(false);
      }
    },
    updateConnectionTo: async (fromAccountId, oldToAccountId, newToAccountId) => {
      const oldConnections = [...connections];
      try {
        setIsLoading(true);
        const newConnections: Partial<Connection>[] = connections.reduce(
          (prev: Partial<Connection>[], curr) =>
            curr.from === fromAccountId && curr.to === oldToAccountId
              ? [...prev, { from: curr.from }]
              : [...prev, { ...curr }],
          [{ from: fromAccountId, to: newToAccountId }]
        );
        setConnections(newConnections.filter((c) => c.to !== undefined) as Connection[]);
        await updateAccountLinks(newConnections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        setConnections(oldConnections);
      } finally {
        setIsLoading(false);
      }
    },
    updateConnectionReverse: async (fromAccountId, toAccountId) => {
      const oldConnections = [...connections];
      try {
        setIsLoading(true);
        const newConnections: Partial<Connection>[] = connections.reduce(
          (prev: Partial<Connection>[], curr) =>
            curr.from === fromAccountId && curr.to === toAccountId
              ? [...prev, { from: curr.from }]
              : [...prev, { ...curr }],
          [{ from: toAccountId, to: fromAccountId }]
        );
        setConnections(newConnections.filter((c) => c.to !== undefined) as Connection[]);
        await updateAccountLinks(newConnections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        setConnections(oldConnections);
      } finally {
        setIsLoading(false);
      }
    },
    deleteConnection: async (fromAccountId, toAccountId) => {
      const oldConnections = [...connections];
      try {
        setIsLoading(true);
        const newConnections: Partial<Connection>[] = connections.reduce(
          (prev: Partial<Connection>[], curr) =>
            curr.from === fromAccountId && curr.to === toAccountId
              ? [...prev, { from: curr.from }]
              : [...prev, { ...curr }],
          []
        );
        setConnections(newConnections.filter((c) => c.to !== undefined) as Connection[]);
        await updateAccountLinks(newConnections);
        await triggerSSR();
      } catch (e) {
        displayCaughtError(e);
        setConnections(oldConnections);
      } finally {
        setIsLoading(false);
      }
    },
    redrawConnections: (movedAccountId: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const relatedConnections = connections.filter((c) => c.from === movedAccountId || c.to === movedAccountId);
      for (const relatedConnection of relatedConnections) {
        const { from, to } = relatedConnection;
        const connection = actions.findNode<Konva.Arrow>(getConnectionId(from, to));
        if (!connection) return;
        const accountGroupFrom = actions.findNode<Konva.Group>(getAccountGroupId(from))?.getClientRect();
        const accountGroupTo = actions.findNode<Konva.Group>(getAccountGroupId(to))?.getClientRect();
        if (!accountGroupFrom || !accountGroupTo) return;
        const points = calculatePointsForConnection(accountGroupFrom, accountGroupTo);
        connection.points(moveConnectionRelativeToStage(points, stage));
      }
    },
  };

  return (
    <KonvaContext.Provider value={{ actions, data: { isLoading, program, accounts, connections, stageRef } }}>
      {children}
    </KonvaContext.Provider>
  );
}
