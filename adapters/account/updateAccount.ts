import { API_ROUTES } from "~/constants/api_routes";
import { Position } from "~/interfaces/position";

interface UpdateAccountBody {
  accountId: number;
  newPosition: Position;
}

export default async function updateAccount(origin: string, body: UpdateAccountBody): Promise<void> {
  const res = await fetch(API_ROUTES.ACCOUNTS(), {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
