import { GetServerSideProps } from "next";
import absoluteUrl from "next-absolute-url";
import getPrograms from "~/adapters/programs/getPrograms";
import Programs from "~/components/pages/Programs";
import { Program } from "~/interfaces/program";

interface ProgramsPageProps {
  programs: Program[];
}

export default function ProgramsPage({ programs }: ProgramsPageProps) {
  return <Programs programs={programs} />;
}

export const getServerSideProps: GetServerSideProps<ProgramsPageProps> = async ({ req }) => {
  const { origin } = absoluteUrl(req);
  const programs = await getPrograms(origin);
  return { props: { programs: JSON.parse(JSON.stringify(programs)) } };
};
