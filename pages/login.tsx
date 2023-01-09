import { Button, Container, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { ROUTES } from "~/constants/routes";
import { useAuth } from "~/contexts/auth/hooks";

export default function Login() {
  const {
    actions: { connectToPhantom },
  } = useAuth();

  console.log(process.env);

  return (
    <Container maxWidth="lg">
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ height: "100vh" }}>
        <Typography variant="h3">Login</Typography>
        <Typography variant="body1" sx={{ maxWidth: 380, textAlign: "center" }}>
          By logging in you are agreeing to the manufacterers <br /> Privacy Policy and Terms of use. **
          {process.env.NEST_HOST}** DOPPLER_ENVIRONMENT - {process.env.DOPPLER_ENVIRONMENT}**
        </Typography>
        <Button variant="contained" onClick={connectToPhantom}>
          Login
        </Button>
      </Stack>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const authSid = req?.cookies["connect.sid"];
  if (authSid) return { redirect: { permanent: false, destination: ROUTES.PROGRAMS() }, props: {} };
  return { props: {} };
};
