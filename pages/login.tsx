import { Button, Container, Stack } from "@mui/material";
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
      <Stack direction="column" justifyContent="space-around" alignItems="center" spacing={2} sx={{ height: "100vh" }}>
        <Button
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
