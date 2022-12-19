import Konva from "konva";
import { Ref, useEffect, useRef, useState } from "react";
import { useKonva } from "~/contexts/konva/hooks";
import { Account } from "~/interfaces/account";
import { Position } from "~/interfaces/position";
import {
  calculateAccountRectHeight,
  calculateCenteredAccountNamePosition,
  calculateCenteredAttributeNamePosition,
} from "~/utils/konva";

interface UseAccountHookReturn {
  groupRef: Ref<Konva.Group>;
  rectRef: Ref<Konva.Rect>;
  nameRef: Ref<Konva.Text>;
  attributesGroupRef: Ref<Konva.Group>;
  canMove: boolean;
  onDragMove: () => void;
  onDragStart: (pos: Position) => void;
  onDragEnd: (pos: Position) => Promise<void>;
}

export default function useAccount(account: Account): UseAccountHookReturn {
  const groupRef = useRef<Konva.Group>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const nameRef = useRef<Konva.Text>(null);
  const attributesGroupRef = useRef<Konva.Group>(null);
  const [lastPos, setLastPos] = useState<Position>(account.position || { x: 0, y: 0 });
  const [canMove, setCanMove] = useState<boolean>(false);
  const konva = useKonva();

  const onDragMove = () => konva.actions.repositionArrows(account.id);
  const onDragStart = (pos: Position) => setLastPos(pos);
  const onDragEnd = async (pos: Position) => {
    setCanMove(false);
    const cancelDragCb = () => {
      groupRef.current?.position(lastPos);
      konva.actions.redraw();
    };

    await konva.actions.saveAccountPosition(account.id, pos, cancelDragCb);
    setCanMove(true);
  };

  useEffect(() => {
    const group = groupRef.current as Konva.Group;
    const rect = rectRef.current as Konva.Rect;
    const name = nameRef.current as Konva.Text;
    const attributesGroup = attributesGroupRef.current as Konva.Group;

    // TODO: calculate position to avoid accounts overlapping
    group.position(account.position || { x: 0, y: 0 });
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
    nameRef,
    attributesGroupRef,
    canMove,
    onDragMove,
    onDragStart,
    onDragEnd,
  };
}
