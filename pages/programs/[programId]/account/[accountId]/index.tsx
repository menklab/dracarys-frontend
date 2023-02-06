import { GetServerSideProps } from "next";
import getAccount from "~/adapters/account/getAccount";
import getAccountElements from "~/adapters/account/getAccountElements";
import getAccounts from "~/adapters/account/getAccounts";
import getInstructions from "~/adapters/instruction/getInstructions";
import getProgram from "~/adapters/program/getProgram";
import AccountPage from "~/components/pages/AccountPage";
import { Account } from "~/interfaces/account";
import { AccountElement } from "~/interfaces/accountElement";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";
import getSidCookie from "~/utils/getSidCookie";
import serverLogout from "~/utils/serverLogout";

interface AccountPageProps {
  program: Program;
  instructions: Instruction[];
  accounts: Account[];
  account: Account;
  accountElements: AccountElement[];
}

export default function AccountIndexPage({
  program,
  accounts,
  account,
  accountElements,
  instructions,
}: AccountPageProps) {
  return (
    <AccountPage
      program={program}
      accounts={accounts}
      account={account}
      accountElements={accountElements}
      instructions={instructions}
    />
  );
}

export const getServerSideProps: GetServerSideProps<AccountPageProps> = async ({ req, res, params }) => {
  try {
    const { programId, accountId } = params || {};
    const sid = getSidCookie(req);
    const program = await getProgram(sid, Number(programId));
    const accounts = await getAccounts(sid, Number(programId));
    const account = await getAccount(sid, Number(accountId));
    const instructions = await getInstructions(sid, Number(programId));
    const accountElements = await getAccountElements(sid, Number(accountId));
    return {
      props: {
        program: JSON.parse(JSON.stringify(program)),
        instructions: JSON.parse(JSON.stringify(instructions)),
        accounts: JSON.parse(JSON.stringify(accounts)),
        account: JSON.parse(JSON.stringify(account)),
        accountElements: JSON.parse(JSON.stringify(accountElements)),
      },
    };
  } catch (e) {
    if ((e as { statusCode: number }).statusCode === 403) serverLogout(res);
    return { props: { program: {}, instructions: [], accounts: [], account: {}, accountElements: [] } };
  }
};
