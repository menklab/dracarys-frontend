import { API_ROUTES } from "~/constants/api_routes";

// FE usage only
export default async function generateAccountCode(programId: number): Promise<string[]> {
  const res = await fetch(API_ROUTES.GENERATE_CODE_ACCOUNT() + `/?programId=${programId}`, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data || [];
}
