import { API_ROUTES } from "~/constants/api_routes";
import { Account } from "~/interfaces/account";

interface CreateAccountBody {
  name: string;
  programId: number;
}

type ReturnAccountJsonResponse = {
  id: number;
  name: string;
  coordinates: [number, number];
  linkedAccounts: number[];
  createdAt: string;
  updatedAt: string;
};

// FE usage only
export default async function createAccount(body: CreateAccountBody): Promise<Account> {
  const res = await fetch(API_ROUTES.ACCOUNTS(), {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as ReturnAccountJsonResponse;
  return {
    id: data.id,
    name: data.name,
    position: { x: data.coordinates[0], y: data.coordinates[1] },
    linkedAccounts: data.linkedAccounts,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
