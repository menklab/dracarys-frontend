import { GetServerSideProps } from "next";
import absoluteUrl from "next-absolute-url";
import dynamic from "next/dynamic";
import getAccounts from "~/adapters/account/getAccounts";
import { Account } from "~/interfaces/account";
const KonvaProvider = dynamic(() => import("~/contexts/konva/provider"), { ssr: false });
const KonvaStage = dynamic(() => import("~/components/konva/Stage"), { ssr: false });

interface HomeProps {
  accounts: Account[];
}

export default function Home({ accounts }: HomeProps) {
  return (
    <div>
      <KonvaProvider accounts={accounts}>
        <KonvaStage />
      </KonvaProvider>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ req }) => {
  const { origin } = absoluteUrl(req);
  const accounts = await getAccounts(origin);
  if (!accounts) return { props: { accounts: [] } };

  // issue: https://github.com/vercel/next.js/discussions/11209
  // NOTE: json validation happens only in dev environment
  return { props: { accounts: JSON.parse(JSON.stringify(accounts)) } };
};
