import Konva from "konva";
import { Ref, useEffect, useRef } from "react";
import { useKonva } from "~/contexts/konva/hooks";
import { calculatePointsForConnection, getAccountGroupId } from "~/utils/konva";

interface UseAccountHookReturn {
  arrowRef: Ref<Konva.Arrow>;
}

export default function useConnection(from: number, to: number): UseAccountHookReturn {
  const arrowRef = useRef<Konva.Arrow>(null);
  const konva = useKonva();

  useEffect(() => {
    if (!arrowRef.current) return;

    const accountGroupFrom = konva.actions.findNode<Konva.Group>(getAccountGroupId(from))?.getClientRect();
    const accountGroupTo = konva.actions.findNode<Konva.Group>(getAccountGroupId(to))?.getClientRect();
    if (!accountGroupFrom || !accountGroupTo) return;

    const points = calculatePointsForConnection(accountGroupFrom, accountGroupTo);
    arrowRef.current.points(points);
    konva.actions.redraw();
  }, []);

  return { arrowRef };
}
