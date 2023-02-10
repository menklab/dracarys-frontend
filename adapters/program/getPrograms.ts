import { API_ROUTES } from "~/constants/api_routes";
import { Program } from "~/interfaces/program";

type GetProgramsJsonResponse = {
  id: number;
  name: string;
  center?: [number, number];
  zoom?: number;
  createdAt: string;
  updatedAt: string;
}[];

// SSR usage only
export default async function getPrograms(sid: string): Promise<Program[]> {
  const res = await fetch(API_ROUTES.PROGRAMS(), { method: "GET", headers: { cookie: `connect.sid=${sid}` } });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetProgramsJsonResponse;
  return (data || [])?.map((program) => ({
    id: program.id,
    name: program.name,
    ...(program?.center ? { center: { x: program.center[0], y: program.center[1] } } : {}),
    ...(program?.zoom ? { zoom: program.zoom } : {}),
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
  }));
}
