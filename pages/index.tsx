import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Layout from "~/components/Layout";
import { ROUTES } from "~/constants/routes";
import { Account } from "~/interfaces/account";
const KonvaProvider = dynamic(() => import("~/contexts/konva/provider"), { ssr: false });
const KonvaStage = dynamic(() => import("~/components/konva/Stage"), { ssr: false });

interface HomeProps {
  accounts: Account[];
}

export default function Home({ accounts }: HomeProps) {
  return (
    <Layout>
      <KonvaProvider accounts={accounts}>
        <KonvaStage />
      </KonvaProvider>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return { redirect: { permanent: false, destination: ROUTES.PROGRAMS() }, props: {} };
  // NOTE: commented for future use
  /*
  // NOTE: healthy response from backend must be an empty array of accounts
  // if SSR fails due to backend failure it should be treated as 500 error
  // p.s. 401 error should be handled differently
  const {programId} = params || {};
  const accounts = await getAccounts(programId);
  // issue: https://github.com/vercel/next.js/discussions/11209
  // NOTE: json validation happens only in dev environment
  return { props: { accounts: JSON.parse(JSON.stringify(accounts)) } };
  */
};
