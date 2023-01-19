import { API_ROUTES } from "~/constants/api_routes";
import { AccountElement, ElementType } from "~/interfaces/accountElement";

type GetAccountElementsJsonResponse = {
  id: number;
  name: string;
  type: ElementType;
  createdAt: string;
  updatedAt: string;
}[];

// SSR usage only
export default async function getAccountElements(sid: string, accountId: number): Promise<AccountElement[]> {
  const res = await fetch(API_ROUTES.ACCOUNTS_ELEMENTS() + `/?accountId=${String(accountId)}`, {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetAccountElementsJsonResponse;
  return data || [];
}
