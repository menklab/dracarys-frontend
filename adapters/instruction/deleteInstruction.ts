import { API_ROUTES } from "~/constants/api_routes";

// FE usage only
export default async function deleteInstruction(instructionId: number): Promise<void> {
  const res = await fetch(API_ROUTES.INSTRUCTION() + `/${instructionId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
