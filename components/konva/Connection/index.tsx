import Konva from "konva";
import { Arrow } from "react-konva";
import useConnection from "~/components/konva/Connection/useConnection";
import { KONVA_CONNECTION_FILL_COLOR, KONVA_CONNECTION_STROKE_COLOR } from "~/constants/konva";
import { useKonva } from "~/contexts/konva/hooks";
import { calculatePointsForConnection, getAccountGroupId, getConnectionId } from "~/utils/konva";

interface ConnectionProps {
  from: number;
  to: number;
}

export default function KonvaConnection({ from, to }: ConnectionProps) {
  const { arrowRef } = useConnection(from, to);
  const konva = useKonva();

  const accountGroupFrom = konva.actions.findNode<Konva.Group>(getAccountGroupId(from))?.getClientRect();
  const accountGroupTo = konva.actions.findNode<Konva.Group>(getAccountGroupId(to))?.getClientRect();
  if (!accountGroupFrom || !accountGroupTo) return null;

  const points = calculatePointsForConnection(accountGroupFrom, accountGroupTo);

  return (
    <Arrow
      ref={arrowRef}
      id={getConnectionId(from, to)}
      stroke={KONVA_CONNECTION_STROKE_COLOR}
      fill={KONVA_CONNECTION_FILL_COLOR}
      points={points}
    />
  );
}
