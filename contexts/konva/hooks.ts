import { useContext } from "react";
import { KonvaContext } from "~/contexts/konva/context";

export const useKonva = () => {
  const konva = useContext(KonvaContext);
  if (konva === undefined) throw new Error("Cannot use konva context");
  return konva;
};
