import { Button, Container, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuth from "~/components/Auth/useAuth";

export default function Login() {
  const router = useRouter();
  const {
    data: { pubKey },
    actions: { connectToPhantom },
  } = useAuth();

  useEffect(() => {
    console.log(pubKey, "check redireckt");
    if (pubKey) {
      console.log("redirect to /");
      // router.push("/");
    }
  }, [pubKey]);

  return (
    <Container maxWidth="lg">
      <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={2} sx={{ height: "100vh" }}>
        <Button
          onClick={() => {
            connectToPhantom();
          }}
        >
          Login
        </Button>
      </Stack>
    </Container>
  );
}
