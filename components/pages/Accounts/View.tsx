import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import CodeBlock from "~/components/Code/CodeBlock";
import KonvaLoading from "~/components/konva/KonvaLoading";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import CreateAccountDialog from "~/components/pages/Accounts/CreateAccountDialog";
import CreateInstructionDialog from "~/components/pages/Accounts/CreateInstructionDialog";
import KonvaProvider from "~/contexts/konva/provider";

const KonvaStage = dynamic(() => import("~/components/konva/Stage"), { ssr: false, loading: () => <KonvaLoading /> });

export default function View() {
  const { program, accounts, viewVariant, forceCodeUpdate, generatedCodeString } = useAccountsPage();

  return (
    <Box>
      {/* NOTE: this is done to prevent unnecessary conditional rendering */}
      <Box sx={{ display: viewVariant === "visual" ? "block" : "none" }}>
        <KonvaProvider program={program} accounts={accounts}>
          <KonvaStage />
        </KonvaProvider>
      </Box>
      <Box sx={{ display: viewVariant === "code" ? "block" : "none" }}>
        <CodeBlock forceCodeUpdate={forceCodeUpdate} generatedCodeString={generatedCodeString} />
      </Box>
      <CreateAccountDialog />
      <CreateInstructionDialog />
    </Box>
  );
}
