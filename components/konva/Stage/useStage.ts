import Konva from "konva";
import { Ref, RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  KONVA_ACCOUNT_CROWN_MAKER_ID,
  KONVA_CONNECTION_FILL_COLOR,
  KONVA_CONNECTION_MAKER_ID,
  KONVA_CONNECTION_STROKE_COLOR,
  KONVA_CONNECTION_STROKE_WIDTH,
} from "~/constants/konva";
import { useKonva } from "~/contexts/konva/hooks";
import { Cursor } from "~/enums/cursor";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";
import { Size } from "~/types/konva";

interface UseStageHookReturn {
  stageRef: RefObject<Konva.Stage>;
  layerRef: Ref<Konva.Layer>;
  containerRef: RefObject<HTMLDivElement>;
  size: Size;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  accounts: Account[];
  connections: Connection[];
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseMove: () => void;
}

export default function useStage(): UseStageHookReturn {
  const layerRef = useRef<Konva.Layer>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const konva = useKonva();
  const {
    data: { accounts, stageRef },
  } = konva;

  const connections = useMemo(
    () =>
      accounts.reduce(
        (prev: Connection[], curr) => [
          ...prev,
          ...(curr.linkedAccounts.map((connection) => ({ from: curr.id, to: connection })) || []),
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
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    let direction = e.evt.deltaY > 0 ? 1 : -1;
    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) direction = -direction;
    const newScale = direction > 0 ? oldScale * 1.05 : oldScale / 1.05;
    stage.scale({ x: newScale, y: newScale });
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
    stage.position(newPos);
  };

  const onMouseDown = () => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;

    const pointer = stage.getPointerPosition();
    const shape = stage.getIntersection({ x: pointer?.x!, y: pointer?.y! });
    if (!shape?.attrs?.id?.startsWith(KONVA_ACCOUNT_CROWN_MAKER_ID)) return;

    const scale = stage.scaleX();
    const mousePointTo = { x: (pointer?.x! - stage.x()) / scale, y: (pointer?.y! - stage.y()) / scale };
    const arrow = new Konva.Arrow({
      id: KONVA_CONNECTION_MAKER_ID,
      points: [mousePointTo.x, mousePointTo.y],
      stroke: KONVA_CONNECTION_STROKE_COLOR,
      strokeWidth: KONVA_CONNECTION_STROKE_WIDTH,
      fill: KONVA_CONNECTION_FILL_COLOR,
    });
    layer.add(arrow);
  };

  const onMouseMove = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const arrow = konva.actions.findNode<Konva.Arrow>(KONVA_CONNECTION_MAKER_ID);
    if (!arrow) return;

    stage.container().style.cursor = Cursor.POINTER;
    const scale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = { x: (pointer?.x! - stage.x()) / scale, y: (pointer?.y! - stage.y()) / scale };
    const points = [arrow.points()[0], arrow.points()[1], mousePointTo.x, mousePointTo.y];
    arrow.points(points);
    stage.draw();
  };

  const onMouseUp = async () => {
    const stage = stageRef.current;
    if (!stage) return;

    const arrow = konva.actions.findNode<Konva.Arrow>(KONVA_CONNECTION_MAKER_ID);
    if (!arrow) return;

    arrow.destroy();
    stage.container().style.cursor = Cursor.DEFAULT;
    let fromAccountId: number = -1;
    let toAccountId: number = -1;
    const fromIntersections: Konva.Shape[] = stage.getAllIntersections({ x: arrow.points()[0], y: arrow.points()[1] });
    const toIntersections: Konva.Shape[] = stage.getAllIntersections({ x: arrow.points()[2], y: arrow.points()[3] });

    for (const fromIntersection of fromIntersections) {
      const id = fromIntersection.attrs.id.replace(/^\D+/g, "");
      if (!isNaN(id)) {
        fromAccountId = +id;
        break;
      }
    }

    for (const toIntersection of toIntersections) {
      const id = toIntersection.attrs.id.replace(/^\D+/g, "");
      if (!isNaN(id)) {
        toAccountId = +id;
        break;
      }
    }

    if (fromAccountId < 0 || toAccountId < 0) return;
    if (fromAccountId === toAccountId) return;

    await konva.actions.createConnection(fromAccountId, toAccountId);
  };

  return {
    stageRef,
    layerRef,
    containerRef,
    size,
    onWheel,
    accounts,
    connections,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
