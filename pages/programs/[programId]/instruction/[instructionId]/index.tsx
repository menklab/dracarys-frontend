import { GetServerSideProps } from "next";
import getAccounts from "~/adapters/account/getAccounts";
import getInstruction from "~/adapters/instruction/getInstruction";
import getInstructionElements from "~/adapters/instruction/getInstructionElements";
import getInstructions from "~/adapters/instruction/getInstructions";
import getProgram from "~/adapters/program/getProgram";
import InstructionPage from "~/components/pages/InstructionPage";
import { ROUTES } from "~/constants/routes";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { InstructionElement } from "~/interfaces/instructionElement";
import { Program } from "~/interfaces/program";
import getSidCookie from "~/utils/getSidCookie";
import serverLogout from "~/utils/serverLogout";

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

export const getServerSideProps: GetServerSideProps<InstructionPageProps> = async ({ req, res, params }) => {
  try {
    const { programId, instructionId } = params || {};
    const sid = getSidCookie(req);
    const program = await getProgram(sid, Number(programId));
    const accounts = await getAccounts(sid, Number(programId));
    const instructions = await getInstructions(sid, Number(programId));
    const instruction = await getInstruction(sid, Number(instructionId));
    const instructionElements = await getInstructionElements(sid, Number(instructionId));

    if (!instructions.some((a) => a.id === instruction.id)) {
      return { redirect: { permanent: false, destination: ROUTES.INSTRUCTIONS(Number(programId)) }, props: {} };
    }

    return {
      props: {
        program: JSON.parse(JSON.stringify(program)),
        instruction: JSON.parse(JSON.stringify(instruction)),
        instructionElements: JSON.parse(JSON.stringify(instructionElements)),
        instructions: JSON.parse(JSON.stringify(instructions)),
        accounts: JSON.parse(JSON.stringify(accounts)),
      },
    };
  } catch (e) {
    if ((e as { statusCode: number }).statusCode === 403) serverLogout(res);
    return { props: { program: {}, instruction: {}, instructionElements: [], instructions: [], accounts: [] } };
  }
};
