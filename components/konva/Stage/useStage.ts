import Konva from "konva";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useKonva } from "~/contexts/konva/hooks";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";
import { Size } from "~/types/konva";

interface UseStageHookReturn {
  stageRef: RefObject<Konva.Stage>;
  containerRef: RefObject<HTMLDivElement>;
  size: Size;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  accounts: Account[];
  connections: Connection[];
}

export default function useStage(): UseStageHookReturn {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (containerRef.current)
      setSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
  }, [containerRef]);

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    e.evt.preventDefault();

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * 1.05 : oldScale / 1.05;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
  };

  return {
    stageRef,
    containerRef,
    size,
    onWheel,
    accounts,
    connections,
  };
}
