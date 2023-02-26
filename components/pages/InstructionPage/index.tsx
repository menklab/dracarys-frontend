import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/InstructionPage/AppBarContent";
import { InstructionPageProvider } from "~/components/pages/InstructionPage/context";
import DeleteInstructionDialog from "~/components/pages/InstructionPage/DeleteInstructionDialog";
import DrawerContent from "~/components/pages/InstructionPage/DrawerContent";
import EditInstructionDialog from "~/components/pages/InstructionPage/EditInstructionDialog";
import View from "~/components/pages/InstructionPage/View";
import { Account } from "~/interfaces/account";
import { GenericType } from "~/interfaces/genericType";
import { Instruction } from "~/interfaces/instruction";
import { InstructionElement } from "~/interfaces/instructionElement";
import { Program } from "~/interfaces/program";

interface InstructionProps {
  program: Program;
  accounts: Account[];
  instructions: Instruction[];
  instruction: Instruction;
  instructionElements: InstructionElement[];
  genericTypes: GenericType;
}

export default function InstructionPage({
  program,
  accounts,
  instructions,
  instruction,
  genericTypes,
  instructionElements,
}: InstructionProps) {
  return (
    <InstructionPageProvider
      program={program}
      accounts={accounts}
      instructions={instructions}
      genericTypes={genericTypes}
      instruction={instruction}
      instructionElements={instructionElements}
    >
      <Layout drawerContent={<DrawerContent />} appBarContent={<AppBarContent />}>
        <DndProvider backend={HTML5Backend}>
          <View key={`instruction-${instruction.id}`} />
        </DndProvider>
        <DeleteInstructionDialog />
        <EditInstructionDialog />
      </Layout>
    </InstructionPageProvider>
  );
}
