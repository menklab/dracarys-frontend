import Konva from "konva";
import { debounce } from "lodash";
import { Ref, RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  KONVA_ACCOUNT_CROWN_MAKER_ID,
  KONVA_CONNECTION_MAKER_ID,
  KONVA_CONNECTION_STROKE_WIDTH,
  KONVA_DEFAULT_STAGE_POSITION,
  KONVA_DEFAULT_STAGE_SCALE,
} from "~/constants/konva";
import { useKonva } from "~/contexts/konva/hooks";
import { useTheme } from "~/contexts/theme/hooks";
import { Cursor } from "~/enums/cursor";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";
import { Position } from "~/interfaces/position";
import { Size } from "~/types/konva";
import { setCursorOnStage } from "~/utils/konva";

interface UseStageHookReturn {
  stageRef: RefObject<Konva.Stage>;
  layerRef: Ref<Konva.Layer>;
  containerRef: RefObject<HTMLDivElement>;
  size: Size;
  onDoubleClick: (e: Konva.KonvaEventObject<MouseEvent>) => Promise<void>;
  onDragStart: (pos: Position) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => Promise<void>;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => Promise<void>;
  accounts: Account[];
  connections: Connection[];
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseMove: () => void;
  isLoading: boolean;
}

export default function useStage(): UseStageHookReturn {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [oldPosition, setOldPosition] = useState<Position | undefined>();
  const layerRef = useRef<Konva.Layer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    data: { program, accounts, stageRef, connections, isLoading },
    actions: { findNode, resetStageAppearance, updateStagePosition, updateStageScale, createConnection },
  } = useKonva();
  const {
    data: { theme },
  } = useTheme();

  useEffect(() => {
    if (containerRef.current)
      setSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
  }, [containerRef]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (program.zoom) stage.scale({ x: program.zoom, y: program.zoom });
    if (program.center) stage.position(program.center);
  }, [program.center, program.zoom, stageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.draggable(!isLoading);
  }, [isLoading, stageRef]);

  const onDoubleClick = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scale();
    const oldPosition = stage.position();
    stage.scale({ x: KONVA_DEFAULT_STAGE_SCALE, y: KONVA_DEFAULT_STAGE_SCALE });
    stage.position(KONVA_DEFAULT_STAGE_POSITION);
    await resetStageAppearance(() => {
      stage.scale(oldScale);
      stage.position(oldPosition);
    });
  };

  const onDragStart = (pos: Position) => setOldPosition(pos);

  const onDragEnd = async (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    if (e.target !== stage) return; // NOTE: drag on stage only
    await updateStagePosition(e.target.position(), () => stage.position(oldPosition!));
  };

  const debouncedUpdateStageScale = useMemo(
    () => debounce((center: Position, zoom: number) => updateStageScale(center, zoom), 100),
    [updateStageScale]
  );

  useEffect(() => () => debouncedUpdateStageScale.cancel(), [debouncedUpdateStageScale]);

  const onWheel = async (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    let direction = e.evt.deltaY > 0 ? 1 : -1;
    // NOTE: when we zoom on trackpad, e.evt.ctrlKey is true in that case lets revert direction
    if (e.evt.ctrlKey) direction = -direction;
    const newScale = direction > 0 ? oldScale * 1.025 : oldScale / 1.025;
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    await debouncedUpdateStageScale(newPos, newScale);
  };

  const onMouseDown = () => {
    if (isLoading) return;
    const stage = stageRef.current;
    const layer = layerRef.current;
    const pointer = stage?.getPointerPosition();
    if (!stage || !layer || !pointer) return;
    const shape = stage.getIntersection({ x: pointer.x, y: pointer.y });
    if (!shape?.attrs?.id?.startsWith(KONVA_ACCOUNT_CROWN_MAKER_ID)) return;
    const scale = stage.scaleX();
    const mousePointTo = { x: (pointer.x - stage.x()) / scale, y: (pointer.y - stage.y()) / scale };
    layer.add(
      new Konva.Arrow({
        id: KONVA_CONNECTION_MAKER_ID,
        points: [mousePointTo.x, mousePointTo.y],
        fill: theme.palette.text.primary,
        stroke: theme.palette.text.primary,
        strokeWidth: KONVA_CONNECTION_STROKE_WIDTH,
      })
    );
  };

  const onMouseMove = () => {
    const stage = stageRef.current;
    const arrow = findNode<Konva.Arrow>(KONVA_CONNECTION_MAKER_ID);
    const pointer = stage?.getPointerPosition();
    if (!stage || !arrow || !pointer) return;
    setCursorOnStage(stage, Cursor.POINTER);
    const scale = stage.scaleX();
    const mousePointTo = { x: (pointer.x - stage.x()) / scale, y: (pointer.y - stage.y()) / scale };
    const points = [arrow.points()[0], arrow.points()[1], mousePointTo.x, mousePointTo.y];
    arrow.points(points);
  };

  const onMouseUp = async () => {
    const stage = stageRef.current;
    const arrow = findNode<Konva.Arrow>(KONVA_CONNECTION_MAKER_ID);
    if (!stage || !arrow) return;
    arrow.destroy();
    setCursorOnStage(stage, Cursor.DEFAULT);

    const positionFrom: Position = {
      x: arrow.points()[0] * stage.scaleX() + stage.x(),
      y: arrow.points()[1] * stage.scaleX() + stage.y(),
    };

    const positionTo: Position = {
      x: arrow.points()[2] * stage.scaleX() + stage.x(),
      y: arrow.points()[3] * stage.scaleX() + stage.y(),
    };

    const intersectionsFrom: Konva.Shape[] = stage.getAllIntersections(positionFrom);
    const intersectionsTo: Konva.Shape[] = stage.getAllIntersections(positionTo);

    let accountIdFrom: number = -1;
    let accountIdTo: number = -1;

    for (const shape of intersectionsFrom) {
      const id = shape.attrs.id.replace(/^\D+/g, "");
      if (!isNaN(id)) {
        accountIdFrom = +id;
        break;
      }
    }

    for (const shape of intersectionsTo) {
      const id = shape.attrs.id.replace(/^\D+/g, "");
      if (!isNaN(id)) {
        accountIdTo = +id;
        break;
      }
    }

    if (accountIdFrom < 0 || accountIdTo < 0) return;
    if (accountIdFrom === accountIdTo) return;

    await createConnection(accountIdFrom, accountIdTo);
  };

  return {
    stageRef,
    layerRef,
    containerRef,
    size,
    onWheel,
    accounts,
    connections,
    onDoubleClick,
    onDragStart,
    onDragEnd,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    isLoading,
  };
}
