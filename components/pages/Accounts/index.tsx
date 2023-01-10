import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/Accounts/AppBarContent";
import { AccountsPageProvider } from "~/components/pages/Accounts/context";
import DeleteProgramDialog from "~/components/pages/Accounts/DeleteProgramDialog";
import DrawerContent from "~/components/pages/Accounts/DrawerContent";
import View from "~/components/pages/Accounts/View";
import { Account } from "~/interfaces/account";
import { Program } from "~/interfaces/program";

interface AccountsProps {
  program: Program;
  accounts: Account[];
}

export default function Accounts({ program, accounts }: AccountsProps) {
  return (
    <AccountsPageProvider program={program}>
      <Layout drawerContent={<DrawerContent accounts={accounts} />} appBarContent={<AppBarContent />}>
        <View />
        <DeleteProgramDialog />
      </Layout>
    </AccountsPageProvider>
  );
}
