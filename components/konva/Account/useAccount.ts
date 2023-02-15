import Konva from "konva";
import { useRouter } from "next/navigation";
import { Ref, useEffect, useRef, useState } from "react";
import { KONVA_ACCOUNT_DEFAULT_POSITION } from "~/constants/konva";
import { ROUTES } from "~/constants/routes";
import { useKonva } from "~/contexts/konva/hooks";
import { Cursor } from "~/enums/cursor";
import { Account } from "~/interfaces/account";
import { Position } from "~/interfaces/position";
import { calculateCenteredAccountNamePosition, setCursorOnStage } from "~/utils/konva";

interface UseAccountHookReturn {
  groupRef: Ref<Konva.Group>;
  rectRef: Ref<Konva.Rect>;
  crownRef: Ref<Konva.Rect>;
  nameRef: Ref<Konva.Text>;
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
  const [lastPos, setLastPos] = useState<Position>(account.position || KONVA_ACCOUNT_DEFAULT_POSITION);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const router = useRouter();
  const {
    data: { stageRef, program, isLoading },
    actions: { redrawConnections, updateAccountPosition },
  } = useKonva();

  useEffect(() => {
    const group = groupRef.current;
    const rect = rectRef.current;
    const crown = crownRef.current;
    const name = nameRef.current;
    if (!group || !rect || !crown || !name) return;
    group.position(account.position || KONVA_ACCOUNT_DEFAULT_POSITION);
    crown.opacity(0);
    name.position(calculateCenteredAccountNamePosition(rect, name));

    // NOTE: for future use
    // rect.height(calculateAccountRectHeight(account.attributes?.length || 0));
    // const attributes = attributesGroup.getChildren() as Konva.Text[];
    // attributes.forEach((attribute, idx) => {
    //   attribute.position(calculateCenteredAttributeNamePosition(rect, idx + 1));
    // });

    setCanMove(true);
  }, []);

  const onDragMove = () => redrawConnections(account.id);

  const onDragStart = (pos: Position) => {
    const stage = stageRef.current;
    if (!stage) return;
    setCursorOnStage(stage, Cursor.MOVE);
    setLastPos(pos);
  };

  const onDragEnd = async (pos: Position) => {
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;
    setCursorOnStage(stage, Cursor.POINTER);
    setCanMove(false);
    await updateAccountPosition(account.id, pos, () => group.position(lastPos));
    setCanMove(true);
  };

  const onClick = () => {
    if (isLoading) return;
    router.push(ROUTES.ACCOUNT(program.id, account.id));
  };

  const onMouseEnter = () => {
    const crown = crownRef.current;
    const stage = stageRef.current;
    if (!crown || !stage) return;
    crown.to({ opacity: 1, duration: 0.4 });
    setIsHovered(true);
    setCursorOnStage(stage, Cursor.POINTER);
  };

  const onMouseLeave = () => {
    const crown = crownRef.current;
    const stage = stageRef.current;
    if (!crown || !stage) return;
    crown.to({ opacity: 0, duration: 0.4 });
    setIsHovered(false);
    setCursorOnStage(stage, Cursor.DEFAULT);
  };

  const onCrownMouseEnter = () => {
    if (isLoading) return;
    const stage = stageRef.current;
    if (!stage) return;
    stage.draggable(false);
    setCanMove(false);
  };

  const onCrownMouseLeave = () => {
    if (isLoading) return;
    const stage = stageRef.current;
    if (!stage) return;
    stage.draggable(true);
    setCanMove(true);
  };

  return {
    groupRef,
    rectRef,
    crownRef,
    nameRef,
    canMove: !isLoading && canMove,
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
