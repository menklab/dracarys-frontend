import Layout from "~/components/Layout";
import AppBarContent from "~/components/pages/Programs/AppBarContent";
import DrawerContent from "~/components/pages/Programs/DrawerContent";
import usePrograms from "~/components/pages/Programs/usePrograms";

interface ProgramsProps {
  programs: any[];
}

// NOTE: page example with layout
export default function Programs({ programs }: ProgramsProps) {
  const program = usePrograms({ programs });

  return (
    <Layout drawerContent={<DrawerContent />} appBarContent={<AppBarContent />}>
      <div></div>
    </Layout>
  );
}
