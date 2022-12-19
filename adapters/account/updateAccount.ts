import { Position } from "~/interfaces/position";

interface UpdateAccountBody {
  accountId: number;
  newPosition: Position;
}

interface UpdateAccountResponse {
  ok: boolean;
}

// TODO: replace origin to nest_host env var when backend dev is ready
// NOTE: this is done for demonstration purposes only
export default async function updateAccount(origin: string, body: UpdateAccountBody): Promise<UpdateAccountResponse> {
  try {
    const res = await fetch(origin + "api/accounts", { method: "PUT", body: JSON.stringify(body) });
    return { ok: res.status === 200 };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
