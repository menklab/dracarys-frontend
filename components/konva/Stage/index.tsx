import { Layer, Stage } from "react-konva";
import KonvaAccount from "~/components/konva/Account";
import KonvaConnection from "~/components/konva/Connection";
import useStage from "~/components/konva/Stage/useStage";

export default function KonvaStage() {
  const { stageRef, accounts, connections } = useStage();

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
      <Layer>
        {accounts.map((account) => (
          <KonvaAccount
            key={account.id}
            id={account.id}
            name={account.name}
            accounts={account.accounts}
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
  );
}
