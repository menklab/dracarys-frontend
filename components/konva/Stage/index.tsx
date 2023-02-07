import { Layer, Stage } from "react-konva";
import KonvaAccount from "~/components/konva/Account";
import KonvaConnection from "~/components/konva/Connection";
import useStage from "~/components/konva/Stage/useStage";

export default function KonvaStage() {
  const {
    stageRef,
    layerRef,
    containerRef,
    size,
    onWheel,
    accounts,
    connections,
    onMouseUp,
    onMouseDown,
    onMouseMove,
  } = useStage();

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 64px)" }} ref={containerRef}>
      <Stage
        width={size.width}
        height={size.height}
        ref={stageRef}
        draggable
        onWheel={onWheel}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <Layer ref={layerRef}>
          {accounts
            // zIndex is ignored while using react version of konva
            // overlaying is controlled by components render order
            .sort((a, b) => b.id - a.id)
            .map((account) => (
              <KonvaAccount
                key={account.id}
                id={account.id}
                name={account.name}
                linkedAccounts={account.linkedAccounts}
                attributes={account.attributes}
                position={account.position}
              />
            ))}
          {connections.map((connection) => (
            <KonvaConnection
              key={`from-${connection.from}-to-${connection.to}`}
              from={connection.from}
              to={connection.to}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
