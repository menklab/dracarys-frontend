import Konva from "konva";
import { RefObject, useEffect, useRef, useState } from "react";
import { HtmlTransformAttrs } from "react-konva-utils";
import { useKonva } from "~/contexts/konva/hooks";
import { Cursor } from "~/enums/cursor";
import { Account } from "~/interfaces/account";
import { Line } from "~/types/konva";
import { calculatePointsForConnection, getAccountGroupId, moveConnectionRelativeToStage } from "~/utils/konva";

interface UseAccountHookReturn {
  onArrowMouseEnter: () => void;
  onArrowMouseLeave: () => void;
  onArrowClick: () => void;
  points: number[];
  isOpened: boolean;
  htmlTransformFunc: (attrs: HtmlTransformAttrs) => HtmlTransformAttrs;
  buttonGroupRef: RefObject<HTMLDivElement>;
  reverseConnection: () => Promise<void>;
  fromOpen: boolean;
  handleFromToggle: () => void;
  handleFromClose: (event: Event) => void;
  toOpen: boolean;
  handleToToggle: () => void;
  handleToClose: (event: Event) => void;
  deleteConnection: () => Promise<void>;
  accounts: Account[];
  fromOptionIsDisabled: (account: Account) => boolean;
  toOptionIsDisabled: (account: Account) => boolean;
  handleFromMenuItemClick: (fromAccountId: number) => Promise<void>;
  handleToMenuItemClick: (toAccountId: number) => Promise<void>;
  arrowRef: RefObject<Konva.Arrow>;
}

export default function useConnection(from: number, to: number): UseAccountHookReturn {
  const arrowRef = useRef<Konva.Arrow>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [fromOpen, setFromOpen] = useState<boolean>(false);
  const [toOpen, setToOpen] = useState<boolean>(false);
  const [points, setPoints] = useState<Line | []>([]);
  const konva = useKonva();
  const { accounts, stageRef } = konva.data;

  const accountFrom = accounts.find((account) => account.id === from)!;
  const accountTo = accounts.find((account) => account.id === to)!;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.on("mousedown", () => {
      setFromOpen(false);
      setToOpen(false);
      setIsOpened(false);
    });
  }, [stageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    const accountGroupFrom = konva.actions.findNode<Konva.Group>(getAccountGroupId(from))?.getClientRect();
    const accountGroupTo = konva.actions.findNode<Konva.Group>(getAccountGroupId(to))?.getClientRect();
    if (!stage || !accountGroupFrom || !accountGroupTo) return;

    const points = calculatePointsForConnection(accountGroupFrom, accountGroupTo);
    setPoints(moveConnectionRelativeToStage(points, stage));
  }, [from, konva.actions, stageRef, to]);

  const onArrowMouseEnter = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.container().style.cursor = Cursor.POINTER;
  };

  const onArrowMouseLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.container().style.cursor = Cursor.DEFAULT;
  };

  const htmlTransformFunc = (attrs: HtmlTransformAttrs) => {
    const stage = stageRef.current;
    if (!stage) return attrs;
    const pointer = stage.getPointerPosition();
    // NOTE: popup offsets
    attrs.x = pointer?.x! - 115;
    attrs.y = pointer?.y! + 15;
    return attrs;
  };

  const onArrowClick = () => setIsOpened(true);

  const reverseConnection = async () => await konva.actions.reverseConnection(from, to);

  const deleteConnection = async () => await konva.actions.deleteConnection(from, to);

  const fromOptionIsDisabled = (account: Account) =>
    accounts
      .reduce((prev: number[], curr) => (curr.id === account.id ? [...prev, ...curr.linkedAccounts] : prev), [])
      .includes(to) ||
    accountTo.linkedAccounts.includes(account.id) ||
    account.id === to;

  const toOptionIsDisabled = (account: Account) =>
    accounts
      .reduce((prev: number[], curr) => (curr.id === account.id ? [...prev, ...curr.linkedAccounts] : prev), [])
      .includes(from) ||
    accountFrom.linkedAccounts.includes(account.id) ||
    account.id === from;

  const handleFromMenuItemClick = async (fromAccountId: number) => {
    setFromOpen(false);
    await konva.actions.changeConnectionFrom(from, fromAccountId, to);
  };

  const handleToMenuItemClick = async (toAccountId: number) => {
    setToOpen(false);
    await konva.actions.changeConnectionTo(from, to, toAccountId);
  };

  const handleFromToggle = () => {
    setFromOpen((prevOpen) => !prevOpen);
    setToOpen(false);
  };

  const handleToToggle = () => {
    setToOpen((prevOpen) => !prevOpen);
    setFromOpen(false);
  };

  const handleFromClose = (event: Event) => {
    if (buttonGroupRef.current?.contains(event.target as HTMLElement)) return;
    setFromOpen(false);
  };

  const handleToClose = (event: Event) => {
    if (buttonGroupRef.current?.contains(event.target as HTMLElement)) return;
    setToOpen(false);
  };

  return {
    arrowRef,
    onArrowMouseEnter,
    onArrowMouseLeave,
    onArrowClick,
    points,
    isOpened,
    htmlTransformFunc,
    buttonGroupRef,
    reverseConnection,
    fromOpen,
    handleFromToggle,
    toOpen,
    handleToToggle,
    deleteConnection,
    handleFromClose,
    accounts,
    fromOptionIsDisabled,
    toOptionIsDisabled,
    handleFromMenuItemClick,
    handleToClose,
    handleToMenuItemClick,
  };
}
