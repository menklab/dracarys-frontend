import { Button, Container, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "~/contexts/auth/hooks";

interface LoginProps {
  isAuthorized?: boolean;
}

export default function Login(props: LoginProps) {
  const { isAuthorized } = props;
  const router = useRouter();

  const {
    actions: { connectToPhantom },
  } = useAuth();

  useEffect(() => {
    if (isAuthorized) {
      router.push("/");
    }
  });

  return (
    <Container maxWidth="lg">
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ height: "100vh" }}>
        <Typography variant="h3">Login</Typography>
        <Typography variant="body1" sx={{ maxWidth: 380, textAlign: "center" }}>
          By logging in you are agreeing to the manufacterers <br /> Privacy Policy and Terms of use.
        </Typography>
        <Button
          variant="contained"
          onClick={async () => {
            await connectToPhantom();
          }}
        >
          Login
        </Button>
      </Stack>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<LoginProps> = async ({ req }) => {
  const authSid = req?.cookies["connect.sid"];
  let isAuthorized = false;
  if (authSid) {
    isAuthorized = true;
  }
  return { props: { isAuthorized } };
};
