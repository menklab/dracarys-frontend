import { API_ROUTES } from "~/constants/api_routes";

interface UpdateInstructionBody {
  name: string;
  description: string | null;
}

// FE usage only
export default async function updateInstruction(instructionId: number, body: UpdateInstructionBody): Promise<void> {
  const res = await fetch(API_ROUTES.INSTRUCTION() + `/${instructionId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
