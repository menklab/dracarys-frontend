import Konva from "konva";
import { useRouter } from "next/navigation";
import { Ref, useEffect, useRef, useState } from "react";
import { KONVA_ACCOUNT_HEADER_HEIGHT, KONVA_ACCOUNT_STROKE_WIDTH, KONVA_ACCOUNT_WIDTH } from "~/constants/konva";
import { ROUTES } from "~/constants/routes";
import { useKonva } from "~/contexts/konva/hooks";
import { Cursor } from "~/enums/cursor";
import { Account } from "~/interfaces/account";
import { Position } from "~/interfaces/position";
import {
  calculateAccountRectHeight,
  calculateCenteredAccountNamePosition,
  calculateCenteredAttributeNamePosition,
  setCursorOnStage,
} from "~/utils/konva";

interface UseAccountHookReturn {
  groupRef: Ref<Konva.Group>;
  rectRef: Ref<Konva.Rect>;
  crownRef: Ref<Konva.Rect>;
  nameRef: Ref<Konva.Text>;
  attributesGroupRef: Ref<Konva.Group>;
  canMove: boolean;
  isHovered: boolean;
  onDragMove: () => void;
  onDragStart: (pos: Position) => void;
  onDragEnd: (pos: Position) => Promise<void>;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCrownMouseEnter: () => void;
  onCrownMouseLeave: () => void;
}

export default function useAccount(account: Account): UseAccountHookReturn {
  const groupRef = useRef<Konva.Group>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const crownRef = useRef<Konva.Rect>(null);
  const nameRef = useRef<Konva.Text>(null);
  const attributesGroupRef = useRef<Konva.Group>(null);
  const [lastPos, setLastPos] = useState<Position>(account.position || { x: 0, y: 0 });
  const [canMove, setCanMove] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const konva = useKonva();
  const router = useRouter();

  const onDragMove = () => {
    const stage = konva.data.stageRef.current;
    const group = groupRef.current;
    if (!group || !stage) return;

    const pos = group.position();
    if (pos.x + KONVA_ACCOUNT_STROKE_WIDTH < 0) group.x(KONVA_ACCOUNT_STROKE_WIDTH);
    if (pos.x + KONVA_ACCOUNT_WIDTH + KONVA_ACCOUNT_STROKE_WIDTH > stage.width())
      group.x(stage.width() - KONVA_ACCOUNT_WIDTH - KONVA_ACCOUNT_STROKE_WIDTH);
    if (pos.y + KONVA_ACCOUNT_STROKE_WIDTH < 0) group.y(KONVA_ACCOUNT_STROKE_WIDTH);
    if (pos.y + KONVA_ACCOUNT_HEADER_HEIGHT + KONVA_ACCOUNT_STROKE_WIDTH > stage.height())
      group.y(stage.height() - KONVA_ACCOUNT_HEADER_HEIGHT - KONVA_ACCOUNT_STROKE_WIDTH);

    konva.actions.repositionArrows(account.id);
  };

  const onDragStart = (pos: Position) => {
    const stage = konva.data.stageRef.current;
    if (!stage) return;

    setLastPos(pos);
    setCursorOnStage(stage, Cursor.MOVE);
  };

  const onDragEnd = async (pos: Position) => {
    const stage = konva.data.stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;

    setCursorOnStage(stage, Cursor.POINTER);
    setCanMove(false);
    const cancelDragCb = () => {
      group.position(lastPos);
      konva.actions.redraw();
    };

    await konva.actions.saveAccountPosition(account.id, pos, cancelDragCb);
    setCanMove(true);
  };

  const onClick = () => router.push(ROUTES.ACCOUNT(konva.data.program.id, account.id));

  const onMouseEnter = () => {
    const crown = crownRef.current;
    const stage = konva.data.stageRef.current;
    if (!crown || !stage) return;

    crown.to({ opacity: 1, duration: 0.4 });
    setIsHovered(true);
    setCursorOnStage(stage, Cursor.POINTER);
  };

  const onMouseLeave = () => {
    const crown = crownRef.current;
    const stage = konva.data.stageRef.current;
    if (!crown || !stage) return;

    crown.to({ opacity: 0, duration: 0.4 });
    setIsHovered(false);
    setCursorOnStage(stage, Cursor.DEFAULT);
  };

  const onCrownMouseEnter = () => {
    const stage = konva.data.stageRef.current;
    if (!stage) return;

    stage.draggable(false);
    setCanMove(false);
  };

  const onCrownMouseLeave = () => {
    const stage = konva.data.stageRef.current;
    if (!stage) return;

    stage.draggable(true);
    setCanMove(true);
  };

  useEffect(() => {
    const group = groupRef.current;
    const rect = rectRef.current;
    const crown = crownRef.current;
    const name = nameRef.current;
    const attributesGroup = attributesGroupRef.current;
    if (!group || !rect || !crown || !name || !attributesGroup) return;

    // TODO: calculate position to avoid accounts overlapping
    group.position(account.position || { x: 0, y: 0 });
    crown.opacity(0);
    rect.height(calculateAccountRectHeight(account.attributes?.length || 0));
    name.position(calculateCenteredAccountNamePosition(rect, name));

    const attributes = attributesGroup.getChildren() as Konva.Text[];
    attributes.forEach((attribute, idx) => attribute.position(calculateCenteredAttributeNamePosition(rect, idx + 1)));

    konva.actions.redraw();
    setCanMove(true);
  }, []);

  return {
    groupRef,
    rectRef,
    crownRef,
    nameRef,
    attributesGroupRef,
    canMove,
    isHovered,
    onDragMove,
    onDragStart,
    onDragEnd,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onCrownMouseEnter,
    onCrownMouseLeave,
  };
}
