import { API_ROUTES } from "~/constants/api_routes";
import { AccountType } from "~/enums/instructionElementTypes";

interface UpdateInstructionElementBody {
  instructionId: number;
  name: string;
  order: number;
  description: string;
  mut: boolean;
  accountType: AccountType;
  genericType: string;
}

// FE usage only
export default async function updateInstructionElement(
  elementId: number,
  body: UpdateInstructionElementBody
): Promise<void> {
  const res = await fetch(API_ROUTES.INSTRUCTION_ELEMENT() + `/${elementId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
