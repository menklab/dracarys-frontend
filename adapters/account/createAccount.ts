import { API_ROUTES } from "~/constants/api_routes";

interface CreateAccountBody {
  name: string;
  programId: number;
}

// FE usage only
export default async function createAccount(body: CreateAccountBody): Promise<void> {
  const res = await fetch(API_ROUTES.ACCOUNTS(), {
    body: JSON.stringify(body),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
