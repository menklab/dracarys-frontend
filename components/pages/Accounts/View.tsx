import CodeBlock from "~/components/Code/CodeBlock";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import CreateAccountDialog from "~/components/pages/Accounts/CreateAccountDialog";
import CreateInstructionDialog from "~/components/pages/Accounts/CreateInstructionDialog";

export default function View() {
  const { viewVariant, getGeneratedAccountCode } = useAccountsPage();
  const innerBlock = viewVariant === "code" ? <CodeBlock getGeneratedCode={getGeneratedAccountCode} /> : <div />;

  return (
    <div>
      {innerBlock}
      <CreateAccountDialog />
      <CreateInstructionDialog />
    </div>
  );
}
