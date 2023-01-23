import { GetServerSideProps } from "next";
import getAccount from "~/adapters/account/getAccount";
import getAccountElements from "~/adapters/account/getAccountElements";
import getAccounts from "~/adapters/account/getAccounts";
import getProgram from "~/adapters/program/getProgram";
import AccountPage from "~/components/pages/AccountPage";
import { Account } from "~/interfaces/account";
import { AccountElement } from "~/interfaces/accountElement";
import { Program } from "~/interfaces/program";

interface AccountPageProps {
  program: Program;
  accounts: Account[];
  account: Account;
  accountElements: AccountElement[];
}

export default function AccountIndexPage({ program, accounts, account, accountElements }: AccountPageProps) {
  return <AccountPage program={program} accounts={accounts} account={account} accountElements={accountElements} />;
}

export const getServerSideProps: GetServerSideProps<AccountPageProps> = async ({ req, params }) => {
  const { programId, accountId } = params || {};
  const sid = req?.cookies["connect.sid"]!;
  const program = await getProgram(sid, Number(programId));
  const accounts = await getAccounts(sid, Number(programId));
  const account = await getAccount(sid, Number(accountId));
  const accountElements = await getAccountElements(sid, Number(accountId));
  return {
    props: {
      program: JSON.parse(JSON.stringify(program)),
      accounts: JSON.parse(JSON.stringify(accounts)),
      account: JSON.parse(JSON.stringify(account)),
      accountElements: JSON.parse(JSON.stringify(accountElements)),
    },
  };
};
