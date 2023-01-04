import { GetServerSideProps } from "next";
import getPrograms from "~/adapters/program/getPrograms";
import Programs from "~/components/pages/Programs";
import { Program } from "~/interfaces/program";

interface ProgramsPageProps {
  programs: Program[];
}

export default function ProgramsPage({ programs }: ProgramsPageProps) {
  return <Programs programs={programs} />;
}

export const getServerSideProps: GetServerSideProps<ProgramsPageProps> = async ({ req }) => {
  const sid = req?.cookies["connect.sid"]!;
  const programs = await getPrograms(sid);
  return { props: { programs: JSON.parse(JSON.stringify(programs)) } };
};
