import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";

export default function AppBarContent() {
  return (
    <Box sx={{ ml: "auto" }}>
      <Button endIcon={<DeleteIcon />}>Delete program</Button>
    </Box>
  );
}
