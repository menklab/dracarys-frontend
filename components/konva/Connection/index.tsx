import { Arrow } from "react-konva";
import useConnection from "~/components/konva/Connection/useConnection";
import { KONVA_CONNECTION_FILL_COLOR, KONVA_CONNECTION_STROKE_COLOR } from "~/constants/konva";
import { getConnectionId } from "~/utils/konva";

interface ConnectionProps {
  from: number;
  to: number;
}

export default function KonvaConnection({ from, to }: ConnectionProps) {
  const { arrowRef } = useConnection(from, to);
  return (
    <Arrow
      id={getConnectionId(from, to)}
      ref={arrowRef}
      stroke={KONVA_CONNECTION_STROKE_COLOR}
      fill={KONVA_CONNECTION_FILL_COLOR}
      // points is not constant, there is no need to set it
      points={[]}
    />
  );
}
