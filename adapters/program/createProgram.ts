import { API_ROUTES } from "~/constants/api_routes";

interface CreateProgramBody {
  name: string;
}

// FE usage only
export default async function createProgram(body: CreateProgramBody): Promise<void> {
  const res = await fetch(API_ROUTES.PROGRAMS(), {
    body: JSON.stringify(body),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
}
