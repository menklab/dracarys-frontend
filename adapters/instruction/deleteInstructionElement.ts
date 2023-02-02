import { API_ROUTES } from "~/constants/api_routes";

// FE usage only
export default async function deleteInstructionElement(instructionId: number): Promise<void> {
  const res = await fetch(API_ROUTES.INSTRUCTION_ELEMENT() + `/${instructionId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
