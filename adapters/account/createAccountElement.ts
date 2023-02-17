import { API_ROUTES } from "~/constants/api_routes";
import { ElementType } from "~/enums/elementType";

interface CreateAccountElementBody {
  accountId: number;
  name: string;
  type: ElementType;
}

export interface CreateAccountElementBodyResponse {
  id: number;
  name: string;
  type: ElementType;
  createdAt: string;
  updatedAt: string;
}

// FE usage only
export default async function createAccount(body: CreateAccountElementBody): Promise<CreateAccountElementBodyResponse> {
  const res = await fetch(API_ROUTES.ACCOUNTS_ELEMENTS(), {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as CreateAccountElementBodyResponse;
  return data || {};
}
