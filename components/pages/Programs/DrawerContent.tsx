import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Link from "next/link";
import { useProgramsPage } from "~/components/pages/Programs/context";
import { ROUTES } from "~/constants/routes";

export default function DrawerContent() {
  const { createProgramDialogOpen } = useProgramsPage();

  return (
    <List>
      <ListItem>
        <ListItemButton onClick={createProgramDialogOpen}>
          <ListItemText>Programs</ListItemText>
          <ListItemIcon sx={{ minWidth: "unset" }}>
            <AddCircleOutlineIcon />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Link href={ROUTES.PROGRAMS()} style={{ textDecoration: "none", color: "unset" }}>
        <ListItem>
          <ListItemButton>
            <ListItemText>View all programs</ListItemText>
          </ListItemButton>
        </ListItem>
      </Link>
    </List>
  );
}
