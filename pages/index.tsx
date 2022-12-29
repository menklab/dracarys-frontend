import { GetServerSideProps } from "next";
import absoluteUrl from "next-absolute-url";
import dynamic from "next/dynamic";
import getAccounts from "~/adapters/account/getAccounts";
import Layout from "~/components/Layout";
import { Account } from "~/interfaces/account";
const KonvaProvider = dynamic(() => import("~/contexts/konva/provider"), { ssr: false });
const KonvaStage = dynamic(() => import("~/components/konva/Stage"), { ssr: false });

interface HomeProps {
  accounts: Account[];
}

declare global {
  interface Window {
    solana: any;
    phantom: any;
  }
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

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ req }) => {
  const { origin } = absoluteUrl(req);
  // NOTE: healthy response from backend must be an empty array of accounts
  // if SSR fails due to backend failure it should be treated as 500 error
  // p.s. 401 error should be handled differently
  const accounts = await getAccounts(origin);
  // issue: https://github.com/vercel/next.js/discussions/11209
  // NOTE: json validation happens only in dev environment
  return { props: { accounts: JSON.parse(JSON.stringify(accounts)) } };
};
