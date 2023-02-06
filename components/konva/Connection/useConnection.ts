import Konva from "konva";
import { Ref, useRef } from "react";

interface UseAccountHookReturn {
  arrowRef: Ref<Konva.Arrow>;
}

export default function useConnection(from: number, to: number): UseAccountHookReturn {
  const arrowRef = useRef<Konva.Arrow>(null);
  return { arrowRef };
}
