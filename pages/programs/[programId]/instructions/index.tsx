import { GetServerSideProps } from "next";
import getAccounts from "~/adapters/account/getAccounts";
import getInstructions from "~/adapters/instruction/getInstructions";
import getProgram from "~/adapters/program/getProgram";
import Instructions from "~/components/pages/Instructions";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";
import getSidCookie from "~/utils/getSidCookie";
import serverLogout from "~/utils/serverLogout";

interface ProgramInstructionsPageProps {
  program: Program;
  accounts: Account[];
  instructions: Instruction[];
}

export default function ProgramInstructionsPage({ program, accounts, instructions }: ProgramInstructionsPageProps) {
  return <Instructions program={program} accounts={accounts} instructions={instructions} />;
}

export const getServerSideProps: GetServerSideProps<ProgramInstructionsPageProps> = async ({ req, res, params }) => {
  try {
    const { programId } = params || {};
    const sid = getSidCookie(req);
    const program = await getProgram(sid, Number(programId));
    const accounts = await getAccounts(sid, Number(programId));
    const instructions = await getInstructions(sid, Number(programId));
    return {
      props: {
        program: JSON.parse(JSON.stringify(program)),
        accounts: JSON.parse(JSON.stringify(accounts)),
        instructions: JSON.parse(JSON.stringify(instructions)),
      },
    };
  } catch (e) {
    if ((e as { statusCode: number }).statusCode === 403) serverLogout(res);
    return { props: { program: {}, accounts: [], instructions: [] } };
  }
};
