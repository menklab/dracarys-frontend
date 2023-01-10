import { GetServerSideProps } from "next";
import getAccounts from "~/adapters/account/getAccounts";
import getProgram from "~/adapters/program/getProgram";
import Accounts from "~/components/pages/Accounts";
import { Account } from "~/interfaces/account";
import { Program } from "~/interfaces/program";

interface ProgramAccountsPageProps {
  program: Program;
  accounts: Account[];
}

export default function ProgramAccountsPage({ program, accounts }: ProgramAccountsPageProps) {
  return <Accounts program={program} accounts={accounts} />;
}

export const getServerSideProps: GetServerSideProps<ProgramAccountsPageProps> = async ({ req, params }) => {
  const { programId } = params || {};
  const sid = req?.cookies["connect.sid"]!;
  const program = await getProgram(sid, Number(programId));
  const accounts = await getAccounts(sid, Number(programId));
  return { props: { program: JSON.parse(JSON.stringify(program)), accounts: JSON.parse(JSON.stringify(accounts)) } };
};
