import dynamic from "next/dynamic";
import CodeBlock from "~/components/Code/CodeBlock";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import CreateAccountDialog from "~/components/pages/Accounts/CreateAccountDialog";
import CreateInstructionDialog from "~/components/pages/Accounts/CreateInstructionDialog";
const KonvaProvider = dynamic(() => import("~/contexts/konva/provider"), { ssr: false });
const KonvaStage = dynamic(() => import("~/components/konva/Stage"), { ssr: false });

export default function View() {
  const { program, accounts, viewVariant, forceCodeUpdate, generatedCodeString } = useAccountsPage();

  return (
    <div>
      {/* NOTE: this is done to prevent unnecessary conditional rendering */}
      <div style={{ display: viewVariant === "visual" ? "block" : "none" }}>
        <KonvaProvider program={program} accounts={accounts}>
          <KonvaStage />
        </KonvaProvider>
      </div>
      <div style={{ display: viewVariant === "code" ? "block" : "none" }}>
        <CodeBlock forceCodeUpdate={forceCodeUpdate} generatedCodeString={generatedCodeString} />
      </div>
      <CreateAccountDialog />
      <CreateInstructionDialog />
    </div>
  );
}
