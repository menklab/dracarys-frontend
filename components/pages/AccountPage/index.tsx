import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/AccountPage/AppBarContent";
import { AccountPageProvider } from "~/components/pages/AccountPage/context";
import DrawerContent from "~/components/pages/AccountPage/DrawerContent";
import View from "~/components/pages/AccountPage/View";
import { Account } from "~/interfaces/account";
import { Program } from "~/interfaces/program";

interface AccountProps {
  program: Program;
  accounts: Account[];
  account: Account;
}

export default function AccountPage({ program, accounts, account }: AccountProps) {
  return (
    <AccountPageProvider account={account} program={program}>
      <Layout
        drawerContent={<DrawerContent accounts={accounts} />}
        appBarContent={<AppBarContent account={account} program={program} />}
      >
        <View account={account} />
      </Layout>
    </AccountPageProvider>
  );
}
