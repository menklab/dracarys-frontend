import { GetServerSideProps } from "next";
import getAccount from "~/adapters/account/getAccount";
import getAccounts from "~/adapters/account/getAccounts";
import getProgram from "~/adapters/program/getProgram";
import AccountPage from "~/components/pages/AccountPage";
import { Account } from "~/interfaces/account";
import { Program } from "~/interfaces/program";

interface AccountPageProps {
  program: Program;
  accounts: Account[];
  account: Account;
}

export default function AccountIndexPage({ program, accounts, account }: AccountPageProps) {
  return <AccountPage program={program} accounts={accounts} account={account} />;
}

export const getServerSideProps: GetServerSideProps<AccountPageProps> = async ({ req, params }) => {
  const { programId, accountId } = params || {};
  const sid = req?.cookies["connect.sid"]!;
  const program = await getProgram(sid, Number(programId));
  const accounts = await getAccounts(sid, Number(programId));
  const account = await getAccount(sid, Number(accountId));
  return {
    props: {
      program: JSON.parse(JSON.stringify(program)),
      accounts: JSON.parse(JSON.stringify(accounts)),
      account: JSON.parse(JSON.stringify(account)),
    },
  };
};
