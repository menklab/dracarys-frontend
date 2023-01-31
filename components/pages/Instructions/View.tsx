import CodeBlock from "~/components/Code/CodeBlock";
import { useInstructionsPage } from "~/components/pages/Instructions/context";
import InstructionsList from "~/components/pages/Instructions/InstructionsList";

export default function View() {
  const { viewVariant, getGeneratedInstructionCode } = useInstructionsPage();

  const innerBlock =
    viewVariant === "code" ? <CodeBlock getGeneratedCode={getGeneratedInstructionCode} /> : <InstructionsList />;

  return <div>{innerBlock}</div>;
}
