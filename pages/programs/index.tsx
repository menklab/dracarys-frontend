import { GetServerSideProps } from "next";
import getPrograms from "~/adapters/program/getPrograms";
import Programs from "~/components/pages/Programs";
import { Program } from "~/interfaces/program";
import getSidCookie from "~/utils/getSidCookie";
import serverLogout from "~/utils/serverLogout";

interface ProgramsPageProps {
  programs: Program[];
}

export default function ProgramsPage({ programs }: ProgramsPageProps) {
  return <Programs programs={programs} />;
}

export const getServerSideProps: GetServerSideProps<ProgramsPageProps> = async ({ req, res }) => {
  try {
    const sid = getSidCookie(req);
    const programs = await getPrograms(sid);
    return { props: { programs: JSON.parse(JSON.stringify(programs)) } };
  } catch (e: any) {
    const errorType = e?.errors.find((error: any) => {
      return error.code === "NOT_AUTHORIZED";
    })?.code;
    if ((e as { statusCode: number }).statusCode === 403) serverLogout(res);
    if (errorType === "NOT_AUTHORIZED") serverLogout(res);
    return { props: { programs: [] } };
  }
};
