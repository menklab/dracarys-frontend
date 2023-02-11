import { Box, CircularProgress } from "@mui/material";

export default function KonvaLoading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 64px)" }}>
      <CircularProgress />
    </Box>
  );
}
