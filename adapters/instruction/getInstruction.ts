import { API_ROUTES } from "~/constants/api_routes";
import { Instruction } from "~/interfaces/instruction";

type GetInstructionsJsonResponse = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

// SSR usage only
export default async function getInstructions(sid: string, instructionId: number): Promise<Instruction> {
  const res = await fetch(API_ROUTES.INSTRUCTION() + `/${instructionId}`, {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetInstructionsJsonResponse;
  return data || {};
}
