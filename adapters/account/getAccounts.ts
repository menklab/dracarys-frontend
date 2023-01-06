import { Account } from "~/interfaces/account";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

interface GetAccountsJsonResponse {
  accounts?: {
    id: number;
    name: string;
    attributes: { name: string; type: string; fieldThatWillNotBeUsedInFrontendApp?: string }[];
    pos?: { x: number; y: number };
    accounts: number[];
  }[];
}

// TODO: replace origin to nest_host env var when backend dev is ready
// NOTE: this is done for demonstration purposes only
export default async function getAccounts(origin: string): Promise<Account[]> {
  const res = await fetch(origin + "/api/accounts", { method: "GET" });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
  const data = (await res.json()) as GetAccountsJsonResponse;
  return (data?.accounts || []).map((account) => ({
    id: account.id,
    name: account.name,
    attributes: account.attributes.map((attribute) => ({ name: attribute.name, type: attribute.type })),
    position: account.pos,
    accounts: account.accounts,
  }));
}
