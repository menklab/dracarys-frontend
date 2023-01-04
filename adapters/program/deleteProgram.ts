import { API_ROUTES } from "~/constants/api_routes";

// FE usage only
export default async function deleteProgram(programId: number): Promise<void> {
  const res = await fetch(API_ROUTES.PROGRAM(programId), { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
}
