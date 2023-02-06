import { API_ROUTES } from "~/constants/api_routes";

interface UpdateAccountLinksBody {
  links: {
    accountId: number;
    linkedAccounts: number[];
  }[];
}

// FE usage only
export default async function updateAccountLinks(body: UpdateAccountLinksBody): Promise<void> {
  const { links } = body;
  const res = await fetch(API_ROUTES.ACCOUNTS_LINKS(), {
    method: "PUT",
    body: JSON.stringify({ links }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
