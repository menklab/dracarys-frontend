import { API_ROUTES } from "~/constants/api_routes";
import { Account } from "~/interfaces/account";

type GetAccountJsonResponse = {
  id: number;
  name: string;
  coordinates: [number, number];
  linkedAccounts: number[];
  createdAt: string;
  updatedAt: string;
};

// SSR usage only
export default async function getAccount(sid: string, accountId: number): Promise<Account> {
  const res = await fetch(API_ROUTES.ACCOUNTS() + `/${accountId}`, {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = (await res.json()) as GetAccountJsonResponse;
  return {
    id: data.id,
    name: data.name,
    position: { x: data.coordinates[0], y: data.coordinates[1] },
    linkedAccounts: data.linkedAccounts,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
