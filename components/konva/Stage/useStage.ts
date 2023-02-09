import Konva from "konva";
import { debounce } from "lodash";
import { Ref, RefObject, useEffect, useMemo, useRef, useState } from "react";
import updateProgram from "~/adapters/program/updateProgram";
import {
  KONVA_ACCOUNT_CROWN_MAKER_ID,
  KONVA_CONNECTION_FILL_COLOR,
  KONVA_CONNECTION_MAKER_ID,
  KONVA_CONNECTION_STROKE_COLOR,
  KONVA_CONNECTION_STROKE_WIDTH,
  KONVA_DEFAULT_STAGE_POSITION,
  KONVA_DEFAULT_STAGE_SCALE,
} from "~/constants/konva";
import { useKonva } from "~/contexts/konva/hooks";
import { Cursor } from "~/enums/cursor";
import useErrorHandler from "~/hooks/useErrorHandler";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";
import { Position } from "~/interfaces/position";
import { Size } from "~/types/konva";

interface UseStageHookReturn {
  stageRef: RefObject<Konva.Stage>;
  layerRef: Ref<Konva.Layer>;
  containerRef: RefObject<HTMLDivElement>;
  size: Size;
  onDoubleClick: (e: Konva.KonvaEventObject<MouseEvent>) => Promise<void>;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => Promise<void>;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => Promise<void>;
  accounts: Account[];
  connections: Connection[];
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseMove: () => void;
}

export default function useStage(): UseStageHookReturn {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const layerRef = useRef<Konva.Layer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { displayCaughtError } = useErrorHandler();
  const konva = useKonva();
  const {
    data: { program, accounts, stageRef },
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (program.zoom) stage.scale({ x: program.zoom, y: program.zoom });
    if (program.center) stage.position(program.center);
  }, [program.center, program.zoom, stageRef]);

  const onDoubleClick = async () => {
    try {
      const stage = stageRef.current;
      if (!stage) return;

      await updateProgram(program.id, {
        name: program.name,
        center: KONVA_DEFAULT_STAGE_POSITION,
        zoom: KONVA_DEFAULT_STAGE_SCALE,
      });

      stage.position(KONVA_DEFAULT_STAGE_POSITION);
      stage.scale({ x: KONVA_DEFAULT_STAGE_SCALE, y: KONVA_DEFAULT_STAGE_SCALE });
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const onDragEnd = async (e: Konva.KonvaEventObject<DragEvent>) => {
    try {
      await updateProgram(program.id, { name: program.name, center: e.target.position(), zoom: program.zoom });
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const debouncedChangeHandler = useMemo(
    () =>
      debounce(
        (center: Position, zoom: number) =>
          updateProgram(program.id, {
            name: program.name,
            center,
            zoom,
          }),
        500
      ),
    [program.id, program.name]
  );

  useEffect(() => () => debouncedChangeHandler.cancel(), [debouncedChangeHandler]);

  const onWheel = async (e: Konva.KonvaEventObject<WheelEvent>) => {
    try {
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

      await debouncedChangeHandler(newPos, newScale);
      stage.scale({ x: newScale, y: newScale });
      stage.position(newPos);
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const onMouseDown = () => {
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
        stroke: KONVA_CONNECTION_STROKE_COLOR,
        strokeWidth: KONVA_CONNECTION_STROKE_WIDTH,
        fill: KONVA_CONNECTION_FILL_COLOR,
      })
    );
  };

  const onMouseMove = () => {
    const stage = stageRef.current;
    const arrow = konva.actions.findNode<Konva.Arrow>(KONVA_CONNECTION_MAKER_ID);
    const pointer = stage?.getPointerPosition();
    if (!stage || !arrow || !pointer) return;

    stage.container().style.cursor = Cursor.POINTER;
    const scale = stage.scaleX();
    const mousePointTo = { x: (pointer.x - stage.x()) / scale, y: (pointer.y - stage.y()) / scale };
    const points = [arrow.points()[0], arrow.points()[1], mousePointTo.x, mousePointTo.y];
    arrow.points(points);
    stage.draw();
  };

  const onMouseUp = async () => {
    const stage = stageRef.current;
    const arrow = konva.actions.findNode<Konva.Arrow>(KONVA_CONNECTION_MAKER_ID);
    if (!stage || !arrow) return;

    arrow.destroy();
    stage.container().style.cursor = Cursor.DEFAULT;

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

    await konva.actions.createConnection(accountIdFrom, accountIdTo);
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
    onDragEnd,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
