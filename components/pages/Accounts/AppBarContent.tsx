import DeleteIcon from "@mui/icons-material/Delete";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAccountsPage } from "~/components/pages/Accounts/context";

export default function AppBarContent() {
  const { viewVariant, changeViewVariant, openDeleteProgramDialog } = useAccountsPage();

  return (
    <>
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
