import { Box } from "@mui/material";
import CodeBlock from "~/components/Code/CodeBlock";
import { useInstructionsPage } from "~/components/pages/Instructions/context";
import InstructionsList from "~/components/pages/Instructions/InstructionsList";

export default function View() {
  const { viewVariant, forceCodeUpdate, generatedCodeString } = useInstructionsPage();

  const innerBlock =
    viewVariant === "code" ? (
      <CodeBlock forceCodeUpdate={forceCodeUpdate} generatedCodeString={generatedCodeString} />
    ) : (
      <InstructionsList />
    );

  return <Box>{innerBlock}</Box>;
}
