import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useProgramsPage } from "~/components/pages/Programs/context";

export default function DrawerContent() {
  const { createProgramDialogOpen } = useProgramsPage();

  return (
    <List>
      <ListItem
        sx={{ px: 4, py: 2 }}
        secondaryAction={
          <IconButton edge="start" onClick={createProgramDialogOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        }
      >
        <ListItemText primary="Programs" />
      </ListItem>
    </List>
  );
}
