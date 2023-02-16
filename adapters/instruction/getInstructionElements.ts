import { API_ROUTES } from "~/constants/api_routes";
import { ElementType } from "~/enums/elementType";
import { AccountElement } from "~/interfaces/accountElement";

type GetInstructionElementsJsonResponse = {
  id: number;
  name: string;
  type: ElementType;
  createdAt: string;
  updatedAt: string;
}[];

// SSR usage only
export default async function getInstructionElements(sid: string, instructionId: number): Promise<AccountElement[]> {
  const res = await fetch(API_ROUTES.INSTRUCTION_ELEMENT() + `/?instructionId=${instructionId}`, {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetInstructionElementsJsonResponse;
  return data || [];
}
