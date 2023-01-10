import { API_ROUTES } from "~/constants/api_routes";
import { Program } from "~/interfaces/program";

type GetProgramJsonResponse = { id: number; name: string; createdAt: string; updatedAt: string };

// SSR usage only
export default async function getProgram(sid: string, programId: number): Promise<Program> {
  const res = await fetch(API_ROUTES.PROGRAM(programId), { method: "GET", headers: { cookie: `connect.sid=${sid}` } });
  if (!res.ok) throw await res.json();
  return { ...((await res.json()) as GetProgramJsonResponse) };
}
