import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Link from "next/link";
import { useInstructionsPage } from "~/components/pages/Instructions/context";
import { ROUTES } from "~/constants/routes";

export default function AppBarContent() {
  const { program, openDeleteProgramDialog, viewVariant, changeViewVariant } = useInstructionsPage();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Link
          key={`program-${program.id}`}
          href={ROUTES.ACCOUNTS(program.id)}
          style={{ textDecoration: "none", color: "unset" }}
        >
          <IconButton sx={{ alignSelf: "self-end" }}>
            <ChevronLeftIcon />
          </IconButton>
        </Link>
        <p style={{ margin: "0 10px", fontSize: "24px" }}>All Instructions</p>
      </div>
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
