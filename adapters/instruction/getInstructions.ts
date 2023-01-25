import { API_ROUTES } from "~/constants/api_routes";
import { Instruction } from "~/interfaces/instruction";

type GetInstructionsJsonResponse = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}[];

// SSR usage only
export default async function getInstructions(sid: string, programId: number): Promise<Instruction[]> {
  const res = await fetch(API_ROUTES.INSTRUCTION() + "?" + new URLSearchParams({ programId: String(programId) }), {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetInstructionsJsonResponse;
  return data || [];
}
