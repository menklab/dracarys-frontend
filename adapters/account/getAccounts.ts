import { API_ROUTES } from "~/constants/api_routes";
import { Account } from "~/interfaces/account";
import { Attribute } from "~/interfaces/attribute";
import { Position } from "~/interfaces/position";

type GetAccountsJsonResponse = {
  id: number;
  name: string;
  attributes?: Attribute[];
  accounts?: number[];
  position?: Position;
}[];

export default async function getAccounts(programId: number): Promise<Account[]> {
  const res = await fetch(API_ROUTES.ACCOUNTS_LIST(programId), { method: "GET" });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetAccountsJsonResponse;
  return (data || []).map((account) => ({ ...account }));
}
