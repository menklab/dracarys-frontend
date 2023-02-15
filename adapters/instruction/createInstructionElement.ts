import { API_ROUTES } from "~/constants/api_routes";
import { AccountType } from "~/enums/instructionElementTypes";

interface CreateInstructionElementBody {
  instructionId: number;
  name: string;
  order: number;
  description: string | null;
  mut: boolean;
  accountType: AccountType;
  genericType: string;
}

// FE usage only
export default async function createInstructionElement(body: CreateInstructionElementBody): Promise<void> {
  const res = await fetch(API_ROUTES.INSTRUCTION_ELEMENT(), {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
