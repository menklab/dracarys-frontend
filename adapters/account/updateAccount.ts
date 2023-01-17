import { API_ROUTES } from "~/constants/api_routes";
import { Position } from "~/interfaces/position";

interface UpdateAccountBody {
  name?: string;
  newPosition?: Position;
}

export default async function updateAccount(accountId: number, body: UpdateAccountBody): Promise<void> {
  const res = await fetch(API_ROUTES.ACCOUNTS() + `/${String(accountId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
