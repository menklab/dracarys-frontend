import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useInstructionsPage } from "~/components/pages/Instructions/context";

export default function AppBarContent() {
  const { openDeleteProgramDialog, viewVariant, changeViewVariant } = useInstructionsPage();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <p style={{ margin: "0 10px", fontSize: "24px" }}>All Instructions</p>
      </Box>
      <ToggleButtonGroup
        size="small"
        sx={{ ml: "auto" }}
        value={viewVariant}
        exclusive
        onChange={(_, v) => changeViewVariant(v)}
      >
        <ToggleButton value="list">List view</ToggleButton>
        <ToggleButton value="code">Code view</ToggleButton>
      </ToggleButtonGroup>
      <Button sx={{ ml: "auto" }} endIcon={<DeleteIcon />} onClick={openDeleteProgramDialog}>
        Delete program
      </Button>
    </>
  );
}
