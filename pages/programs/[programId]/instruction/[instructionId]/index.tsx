import { GetServerSideProps } from "next";
import getAccounts from "~/adapters/account/getAccounts";
import getInstruction from "~/adapters/instruction/getInstruction";
import getInstructionElements from "~/adapters/instruction/getInstructionElements";
import getInstructions from "~/adapters/instruction/getInstructions";
import getProgram from "~/adapters/program/getProgram";
import InstructionPage from "~/components/pages/InstructionPage";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { InstructionElement } from "~/interfaces/instructionElement";
import { Program } from "~/interfaces/program";

interface InstructionPageProps {
  program: Program;
  instructions: Instruction[];
  instruction: Instruction;
  instructionElements: InstructionElement[];
  accounts: Account[];
}

export default function InstructionIndexPage({
  program,
  accounts,
  instructions,
  instruction,
  instructionElements,
}: InstructionPageProps) {
  return (
    <InstructionPage
      program={program}
      accounts={accounts}
      instructions={instructions}
      instruction={instruction}
      instructionElements={instructionElements}
    />
  );
}

export const getServerSideProps: GetServerSideProps<InstructionPageProps> = async ({ req, params }) => {
  const { programId, instructionId } = params || {};
  const sid = req?.cookies["connect.sid"]!;
  const program = await getProgram(sid, Number(programId));
  const accounts = await getAccounts(sid, Number(programId));
  const instructions = await getInstructions(sid, Number(programId));
  const instruction = await getInstruction(sid, Number(instructionId));
  const instructionElements = await getInstructionElements(sid, Number(instructionId));
  return {
    props: {
      program: JSON.parse(JSON.stringify(program)),
      instruction: JSON.parse(JSON.stringify(instruction)),
      instructionElements: JSON.parse(JSON.stringify(instructionElements)),
      instructions: JSON.parse(JSON.stringify(instructions)),
      accounts: JSON.parse(JSON.stringify(accounts)),
    },
  };
};
