import { GetServerSideProps } from "next";
import getAccounts from "~/adapters/account/getAccounts";
import getInstruction from "~/adapters/instruction/getInstruction";
import getInstructions from "~/adapters/instruction/getInstructions";
import getProgram from "~/adapters/program/getProgram";
import InstructionPage from "~/components/pages/InstructionPage";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";

interface InstructionPageProps {
  program: Program;
  instructions: Instruction[];
  instruction: Instruction;
  accounts: Account[];
}

export default function InstructionIndexPage({ program, accounts, instructions, instruction }: InstructionPageProps) {
  return (
    <InstructionPage program={program} accounts={accounts} instructions={instructions} instruction={instruction} />
  );
}

export const getServerSideProps: GetServerSideProps<InstructionPageProps> = async ({ req, params }) => {
  const { programId, instructionId } = params || {};
  const sid = req?.cookies["connect.sid"]!; // processes
  const program = await getProgram(sid, Number(programId));
  const accounts = await getAccounts(sid, Number(programId));
  // const account = await getAccount(sid, Number(accountId));
  const instructions = await getInstructions(sid, Number(programId));
  const instruction = await getInstruction(sid, Number(instructionId));
  // const accountElements = await getAccountElements(sid, Number(accountId));
  return {
    props: {
      program: JSON.parse(JSON.stringify(program)),
      instruction: JSON.parse(JSON.stringify(instruction)),
      instructions: JSON.parse(JSON.stringify(instructions)),
      accounts: JSON.parse(JSON.stringify(accounts)),
    },
  };
};
