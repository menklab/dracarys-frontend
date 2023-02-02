import dynamic from "next/dynamic";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import CreateAccountDialog from "~/components/pages/Accounts/CreateAccountDialog";
import CreateInstructionDialog from "~/components/pages/Accounts/CreateInstructionDialog";
const KonvaProvider = dynamic(() => import("~/contexts/konva/provider"), { ssr: false });
const KonvaStage = dynamic(() => import("~/components/konva/Stage"), { ssr: false });

export default function View() {
  const { program, accounts, viewVariant } = useAccountsPage();

  return (
    <div>
      {/* NOTE: this is done to prevent konva from using old data while moving between tabs */}
      <div style={{ display: viewVariant === "visual" ? "block" : "none" }}>
        <KonvaProvider program={program} accounts={accounts}>
          <KonvaStage />
        </KonvaProvider>
      </div>
      <div style={{ display: viewVariant === "code" ? "block" : "none" }}>
        <div>code!</div>
      </div>
      <CreateAccountDialog />
      <CreateInstructionDialog />
    </div>
  );
}
