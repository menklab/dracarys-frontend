import { API_ROUTES } from "~/constants/api_routes";
import { Account } from "~/interfaces/account";

type GetAccountsJsonResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}[];

// SSR usage only
export default async function getAccount(sid: string, accountId: number): Promise<Account[]> {
  const res = await fetch(API_ROUTES.ACCOUNTS() + `/${String(accountId)}`, {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetAccountsJsonResponse;
  return data || {};
}
