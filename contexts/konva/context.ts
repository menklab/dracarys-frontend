import { createContext } from "react";
import { KonvaContextDefaultValue } from "~/contexts/konva/types";

export const KonvaContext = createContext<KonvaContextDefaultValue | undefined>(undefined);
