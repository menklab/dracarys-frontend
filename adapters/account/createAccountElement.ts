import { API_ROUTES } from "~/constants/api_routes";
import { ElementType } from "~/interfaces/accountElement";

interface CreateAccountElementBody {
  accountId: number;
  name: string;
  type: ElementType;
}

// FE usage only
export default async function createAccount(body: CreateAccountElementBody): Promise<void> {
  const res = await fetch(API_ROUTES.ACCOUNTS_ELEMENTS(), {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
