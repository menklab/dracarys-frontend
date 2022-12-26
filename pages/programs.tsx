import { GetServerSideProps } from "next";
import Programs from "~/components/pages/Programs";

interface ProgramsPageProps {
  programs: any[];
}

export default function ProgramsPage({ programs }: ProgramsPageProps) {
  return <Programs programs={programs} />;
}

export const getServerSideProps: GetServerSideProps<ProgramsPageProps> = async () => {
  return { props: { programs: [] } };
};
