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

export interface CreateInstructionElementJsonResponse {
  id: number;
  name: string;
  order: number;
  description: string | null;
  mut: boolean;
  accountType: AccountType;
  genericType: string;
  createdAt: string;
  updatedAt: string;
}

// FE usage only
export default async function createInstructionElement(
  body: CreateInstructionElementBody
): Promise<CreateInstructionElementJsonResponse | undefined> {
  const res = await fetch(API_ROUTES.INSTRUCTION_ELEMENT(), {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as CreateInstructionElementJsonResponse;
  return data || {};
}
