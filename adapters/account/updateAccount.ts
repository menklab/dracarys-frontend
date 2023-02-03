import { API_ROUTES } from "~/constants/api_routes";
import { Position } from "~/interfaces/position";

interface UpdateAccountBody {
  name?: string;
  coordinates?: Position;
}

// FE usage only
export default async function updateAccount(accountId: number, body: UpdateAccountBody): Promise<void> {
  const { name, coordinates } = body;
  const res = await fetch(API_ROUTES.ACCOUNTS() + `/${accountId}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...(name ? { name } : undefined),
      ...(coordinates ? { coordinates: [coordinates.x, coordinates.y] } : undefined),
    }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
