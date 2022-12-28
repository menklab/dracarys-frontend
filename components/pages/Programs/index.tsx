import Layout from "~/components/Layout";
import { ProgramsPageProvider } from "~/components/pages/Programs/context";
import CreateProgramDialog from "~/components/pages/Programs/CreateProgramDialog";
import DrawerContent from "~/components/pages/Programs/DrawerContent";
import View from "~/components/pages/Programs/View";
import { Program } from "~/interfaces/program";

interface ProgramsProps {
  programs: Program[];
}

export default function Programs({ programs }: ProgramsProps) {
  return (
    <ProgramsPageProvider programs={programs}>
      <Layout drawerContent={<DrawerContent />}>
        <View />
        <CreateProgramDialog />
      </Layout>
    </ProgramsPageProvider>
  );
}
