import { Box, CircularProgress, Fade } from "@mui/material";
import { useKonva } from "~/contexts/konva/hooks";

export default function Loading() {
  const {
    data: { isLoading },
  } = useKonva();

  return (
    <Fade in={isLoading}>
      <Box sx={{ position: "absolute", top: 16, left: 16 }}>
        <CircularProgress size={16} thickness={8} disableShrink />
      </Box>
    </Fade>
  );
}
