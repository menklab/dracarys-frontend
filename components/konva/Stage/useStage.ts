import Konva from "konva";
import { Ref, useMemo } from "react";
import { useKonva } from "~/contexts/konva/hooks";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";

interface UseStageHookReturn {
  stageRef: Ref<Konva.Stage>;
  accounts: Account[];
  connections: Connection[];
}

export default function useStage(): UseStageHookReturn {
  const {
    data: { accounts, stageRef },
  } = useKonva();

  const connections = useMemo(
    () =>
      accounts.reduce(
        (prev: Connection[], curr) => [
          ...prev,
          ...(curr.accounts?.map((connection) => ({ from: curr.id, to: connection })) || []),
        ],
        []
      ),
    [accounts]
  );

  return {
    stageRef,
    accounts,
    connections,
  };
}
