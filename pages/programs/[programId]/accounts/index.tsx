import { GetServerSideProps } from "next";
import getProgram from "~/adapters/program/getProgram";
import Accounts from "~/components/pages/Accounts";
import { Program } from "~/interfaces/program";

interface ProgramAccountsPageProps {
  program: Program;
}

export default function ProgramAccountsPage({ program }: ProgramAccountsPageProps) {
  return <Accounts program={program} />;
}

export const getServerSideProps: GetServerSideProps<ProgramAccountsPageProps> = async ({ req, params }) => {
  const { programId } = params || {};
  const sid = req?.cookies["connect.sid"]!;
  const program = await getProgram(sid, Number(programId));
  return { props: { program: JSON.parse(JSON.stringify(program)) } };
};
