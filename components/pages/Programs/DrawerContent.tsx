import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useProgramsPage } from "~/components/pages/Programs/context";

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
    </List>
  );
}
