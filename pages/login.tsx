import { Button, Container, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ROUTES } from "~/constants/routes";
import { useAuth } from "~/contexts/auth/hooks";
import getSidCookie from "~/utils/getSidCookie";

export default function Login() {
  const {
    actions: { connectToPhantom, provider },
    data: { loginProgress },
  } = useAuth();

  return (
    <Container maxWidth="lg">
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ height: "100vh" }}>
        <Typography variant="h3">Login</Typography>
        <Typography variant="body1" sx={{ maxWidth: 380, textAlign: "center" }}>
          By logging in you are agreeing to the manufacterers <br />
          <Link key="privacy-policy" href={ROUTES.PRIVACY()} target="_blank" style={{ color: "unset" }}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link key="termS-of-use" href={ROUTES.TERMS()} target="_blank" style={{ color: "unset" }}>
            Terms of use.
          </Link>
        </Typography>
        <Button variant="contained" onClick={connectToPhantom} disabled={loginProgress || !provider}>
          {!provider ? "Phantom wallet is required! Please install phantom wallet browser extension" : "Login"}
        </Button>
      </Stack>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const authSid = getSidCookie(req);
  if (authSid) return { redirect: { permanent: false, destination: ROUTES.PROGRAMS() }, props: {} };
  return { props: {} };
};
