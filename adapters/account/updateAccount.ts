import { Position } from "~/interfaces/position";

interface UpdateAccountBody {
  accountId: number;
  newPosition: Position;
}

// TODO: replace origin to nest_host env var when backend dev is ready
// NOTE: this is done for demonstration purposes only
export default async function updateAccount(origin: string, body: UpdateAccountBody): Promise<void> {
  const res = await fetch(origin + "/api/accounts", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
}
