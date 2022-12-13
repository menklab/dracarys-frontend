import { Box, Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MUI v5 + Next.js with TypeScript example
        </Typography>
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  console.log("testing doppler env", process.env.EXAMPLE_ENV);
  return { props: {} };
};
