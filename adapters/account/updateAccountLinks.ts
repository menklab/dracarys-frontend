import { API_ROUTES } from "~/constants/api_routes";
import { Connection } from "~/interfaces/connection";

type AccountLink = { accountId: number; linkedAccounts: number[] };

// FE usage only
export default async function updateAccountLinks(connections: Partial<Connection>[]): Promise<void> {
  const links: AccountLink[] = connections.reduce((prev: AccountLink[], curr) => {
    if (!curr.from) throw "Connection `from` is necessary!";
    const link = prev.find((link) => link.accountId === curr.from);
    if (!link) return [...prev, { accountId: curr.from, linkedAccounts: curr.to ? [curr.to] : [] }];
    else curr.to ? link.linkedAccounts.push(curr.to) : null;
    return prev;
  }, []);

  const res = await fetch(API_ROUTES.ACCOUNTS_LINKS(), {
    method: "PUT",
    body: JSON.stringify({ links }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
