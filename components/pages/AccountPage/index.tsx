import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/AccountPage/AppBarContent";
import { AccountPageProvider } from "~/components/pages/AccountPage/context";
import DeleteAccountDialog from "~/components/pages/AccountPage/DeleteAccountDialog";
import DrawerContent from "~/components/pages/AccountPage/DrawerContent";
import View from "~/components/pages/AccountPage/View";
import { Account } from "~/interfaces/account";
import { AccountElement } from "~/interfaces/accountElement";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";

interface AccountProps {
  program: Program;
  accounts: Account[];
  instructions: Instruction[];
  account: Account;
  accountElements: AccountElement[];
}

export default function AccountPage({ program, accounts, account, accountElements, instructions }: AccountProps) {
  return (
    <AccountPageProvider
      account={account}
      program={program}
      accounts={accounts}
      accountElements={accountElements}
      instructions={instructions}
    >
      <Layout drawerContent={<DrawerContent />} appBarContent={<AppBarContent />}>
        <View key={`view-${account.id}`} />
        <DeleteAccountDialog />
      </Layout>
    </AccountPageProvider>
  );
}
