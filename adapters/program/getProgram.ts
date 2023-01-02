import { Program } from "~/interfaces/program";

interface GetProgramJsonResponse {
  program: Program;
}

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function getProgram(origin: string, programId: number): Promise<Program> {
  const res = await fetch(origin + `/api/programs/${programId}`, { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as GetProgramJsonResponse;
  return data.program;
}
