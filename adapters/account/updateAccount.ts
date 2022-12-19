import { Position } from "~/interfaces/position";

interface UpdateAccountBody {
  accountId: number;
  newPosition: Position;
}

interface UpdateAccountResponse {
  ok: boolean;
}

export default async function updateAccount(body: UpdateAccountBody): Promise<UpdateAccountResponse> {
  try {
    const res = await fetch("/api/accounts", { method: "PUT", body: JSON.stringify(body) });
    return { ok: res.status === 200 };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
