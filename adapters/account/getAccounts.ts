import { Account } from "~/interfaces/account";

interface GetAccountsJsonResponse {
  accounts: {
    id: number;
    name: string;
    attributes: { name: string; type: string; fieldThatWillNotBeUsedInFrontendApp?: string }[];
    pos?: { x: number; y: number };
    accounts: number[];
  }[];
}

export default async function getAccounts(): Promise<Account[] | undefined> {
  try {
    const res = await fetch("http://localhost:3000/api/accounts", { method: "GET" });
    const { accounts } = (await res.json()) as GetAccountsJsonResponse;
    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      attributes: account.attributes.map((attribute) => ({ name: attribute.name, type: attribute.type })),
      position: account.pos,
      accounts: account.accounts,
    }));
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
