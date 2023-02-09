import { API_ROUTES } from "~/constants/api_routes";
import { Position } from "~/interfaces/position";

interface UpdateProgramBody {
  name: string;
  center?: Position;
  zoom?: number;
}

// FE usage only
export default async function updateProgram(programId: number, body: UpdateProgramBody): Promise<void> {
  const { name, center, zoom } = body;
  const res = await fetch(API_ROUTES.PROGRAM(programId), {
    body: JSON.stringify({
      name,
      ...(center ? { center: [center.x, center.y] } : { center: [0, 0] }),
      ...(zoom ? { zoom } : { zoom: 1 }),
    }),
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
