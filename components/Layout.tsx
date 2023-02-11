import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { LoadingButton } from "@mui/lab";
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { ReactNode } from "react";
import logout from "~/adapters/auth/logout";
import ThemeChanger from "~/components/ThemeChanger";
import { LAYOUT_DRAWER_WIDTH } from "~/constants/layout";
import { useAuth } from "~/contexts/auth/hooks";
import { useTheme } from "~/contexts/theme/hooks";
import useErrorHandler from "~/hooks/useErrorHandler";

interface LayoutProps {
  appBarContent?: ReactNode;
  drawerContent?: ReactNode;
  children: ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { appBarContent, drawerContent, children } = props;
  const { displayCaughtError } = useErrorHandler();

  const {
    data: { theme },
  } = useTheme();

  const {
    data: { pubKey },
    actions: { provider, disconnectFromPhantom },
  } = useAuth();

  const pubKeyString = pubKey ? pubKey.toBase58() : "";
  const logOut = provider
    ? async () => {
        try {
          await logout();
        } catch (e) {
          displayCaughtError(e);
        }
        disconnectFromPhantom();
      }
    : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: `calc(100% - ${LAYOUT_DRAWER_WIDTH}px)`,
          ml: `${LAYOUT_DRAWER_WIDTH}px`,
          background: theme.palette.background.default,
        }}
      >
        <Toolbar>{appBarContent}</Toolbar>
      </AppBar>

      <Drawer
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
          <LoadingButton
            loading={!pubKeyString}
            variant="contained"
            sx={{
              width: 240,
              paddingX: 4,
              borderRadius: 9999,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              ...(pubKeyString ? { display: "inline-block" } : {}),
            }}
          >
            {pubKeyString ? pubKeyString : "ㅤ"}
          </LoadingButton>
        </Toolbar>

        {drawerContent}

        <List sx={{ mt: "auto" }}>
          <ListItem sx={{ px: 4, py: 2 }} secondaryAction={<ThemeChanger />}>
            <ListItemText primary="Change theme" />
          </ListItem>
          <ListItem
            sx={{ px: 4, py: 2 }}
            secondaryAction={
              <IconButton edge="start" onClick={logOut}>
                <ExitToAppIcon />
              </IconButton>
            }
          >
            <ListItemText primary="Disconnect wallet" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
