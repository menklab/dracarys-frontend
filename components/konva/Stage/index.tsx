import { Box } from "@mui/material";
import { Layer, Stage } from "react-konva";
import KonvaAccount from "~/components/konva/Account";
import KonvaConnection from "~/components/konva/Connection";
import Loading from "~/components/konva/Stage/Loading";
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
    onDoubleClick,
    onDragStart,
    onDragEnd,
    onMouseUp,
    onMouseDown,
    onMouseMove,
  } = useStage();

  return (
    <Box sx={{ width: "100%", minHeight: "calc(100vh - 64px)", position: "relative" }} ref={containerRef}>
      <Loading />
      <Stage
        width={size.width}
        height={size.height}
        ref={stageRef}
        onDblClick={onDoubleClick}
        onDragStart={(e) => onDragStart(e.target.position())}
        onDragEnd={onDragEnd}
        onWheel={onWheel}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <Layer ref={layerRef}>
          {accounts
            // zIndex is ignored while using react version of konva
            // overlaying is controlled by components render order
            .sort((a, b) => a.id - b.id)
            .map((account) => (
              <KonvaAccount
                key={account.id}
                id={account.id}
                name={account.name}
                linkedAccounts={account.linkedAccounts}
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
    </Box>
  );
}
