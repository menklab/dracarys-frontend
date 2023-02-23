import { API_ROUTES } from "~/constants/api_routes";
import { AccountType } from "~/enums/instructionElementTypes";
import { GenericCustomSubType, GenericSubType } from "~/interfaces/genericType";

interface UpdateInstructionElementBody {
  instructionId: number;
  name: string;
  order: number;
  description: string | null;
  mut: boolean;
  accountType: AccountType;
  genericType: GenericSubType | GenericCustomSubType;
}

export interface UpdateInstructionElementResponse {
  instructionId: number;
  name: string;
  order: number;
  description: string;
  mut: boolean;
  accountType: AccountType;
  genericType: string;
  createdAt: string;
  updatedAt: string;
}

// FE usage only
export default async function updateInstructionElement(
  elementId: number,
  body: UpdateInstructionElementBody
): Promise<UpdateInstructionElementResponse> {
  const res = await fetch(API_ROUTES.INSTRUCTION_ELEMENT() + `/${elementId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as UpdateInstructionElementResponse;
  return data || {};
}
