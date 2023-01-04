import { GetServerSideProps } from "next";
import absoluteUrl from "next-absolute-url";
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
  const { origin } = absoluteUrl(req);
  const programs = await getProgram(origin, Number(programId));
  console.log(programs);
  return { props: { program: JSON.parse(JSON.stringify(programs)) } };
};
