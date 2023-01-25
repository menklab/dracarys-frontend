import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/Instructions/AppBarContent";
import { InstructionsPageProvider } from "~/components/pages/Instructions/context";
import DeleteProgramDialog from "~/components/pages/Instructions/DeleteProgramDialog";
import DrawerContent from "~/components/pages/Instructions/DrawerContent";
import View from "~/components/pages/Instructions/View";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";

interface InstructionsProps {
  program: Program;
  accounts: Account[];
  instructions: Instruction[];
}

export default function Instructions({ program, accounts, instructions }: InstructionsProps) {
  return (
    <InstructionsPageProvider accounts={accounts} instructions={instructions} program={program}>
      <Layout drawerContent={<DrawerContent />} appBarContent={<AppBarContent />}>
        <View />
        <DeleteProgramDialog />
      </Layout>
    </InstructionsPageProvider>
  );
}
