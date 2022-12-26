import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";

export default function DrawerContent() {
  return (
    <List>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <AddCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText>Program</ListItemText>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
