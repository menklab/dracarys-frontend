import { API_ROUTES } from "~/constants/api_routes";

interface CreateInstructionBody {
  name: string;
  description?: string;
  programId: number;
}

// FE usage only
export default async function createInstruction(body: CreateInstructionBody): Promise<void> {
  const res = await fetch(API_ROUTES.INSTRUCTION(), {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
