import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ReactNode } from "react";
import { LAYOUT_DRAWER_WIDTH } from "~/constants/layout";

interface LayoutProps {
  appBarContent?: ReactNode;
  drawerContent?: ReactNode;
  children: ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { appBarContent, drawerContent, children } = props;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        elevation={0}
        position="fixed"
        color="secondary"
        sx={{ width: `calc(100% - ${LAYOUT_DRAWER_WIDTH}px)`, ml: `${LAYOUT_DRAWER_WIDTH}px` }}
      >
        <Toolbar>{appBarContent}</Toolbar>
      </AppBar>

      <Drawer
        PaperProps={{ sx: { backgroundColor: "secondary.main", border: 0 } }}
        sx={{
          width: LAYOUT_DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: LAYOUT_DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              width: 240,
              paddingX: 4,
              borderRadius: 9999,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              display: "inline-block",
            }}
          >
            A2WW236565SWA231A234D2EKJ23453123213
          </Button>
        </Toolbar>

        {drawerContent}

        <List sx={{ mt: "auto" }}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
