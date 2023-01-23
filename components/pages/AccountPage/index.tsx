import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/AccountPage/AppBarContent";
import { AccountPageProvider } from "~/components/pages/AccountPage/context";
import DeleteAccountDialog from "~/components/pages/AccountPage/DeleteAccountDialog";
import DrawerContent from "~/components/pages/AccountPage/DrawerContent";
import View from "~/components/pages/AccountPage/View";
import { Account } from "~/interfaces/account";
import { AccountElement } from "~/interfaces/accountElement";
import { Program } from "~/interfaces/program";

interface AccountProps {
  program: Program;
  accounts: Account[];
  account: Account;
  accountElements: AccountElement[];
}

export default function AccountPage({ program, accounts, account, accountElements }: AccountProps) {
  return (
    <AccountPageProvider account={account} program={program} accounts={accounts} accountElements={accountElements}>
      <Layout drawerContent={<DrawerContent />} appBarContent={<AppBarContent />}>
        <View />
        <DeleteAccountDialog />
      </Layout>
    </AccountPageProvider>
  );
}
