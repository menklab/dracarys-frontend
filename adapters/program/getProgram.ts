import { API_ROUTES } from "~/constants/api_routes";
import { Program } from "~/interfaces/program";

type GetProgramJsonResponse = {
  id: number;
  name: string;
  center?: [number, number];
  zoom?: number;
  createdAt: string;
  updatedAt: string;
};

// SSR usage only
export default async function getProgram(sid: string, programId: number): Promise<Program> {
  const res = await fetch(API_ROUTES.PROGRAM(programId), { method: "GET", headers: { cookie: `connect.sid=${sid}` } });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetProgramJsonResponse;
  return {
    id: data.id,
    name: data.name,
    ...(data?.center ? { center: { x: data.center[0], y: data.center[1] } } : {}),
    ...(data?.zoom ? { zoom: data.zoom } : {}),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
