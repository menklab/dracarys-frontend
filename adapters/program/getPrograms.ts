import { Program } from "~/interfaces/program";

interface GetProgramsJsonResponse {
  programs?: { id: number; name: string }[];
}

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function getPrograms(origin: string): Promise<Program[]> {
  const res = await fetch(origin + "/api/programs", { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as GetProgramsJsonResponse;
  return (data?.programs || []).map((program) => ({
    id: program.id,
    name: program.name,
  }));
}
