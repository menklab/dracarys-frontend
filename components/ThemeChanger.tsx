import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "~/contexts/theme/hooks";

export default function ThemeChanger() {
  const [animationTimeout, setAnimationTimeout] = useState<number>(0);
  const {
    actions: { toggleColorMode },
    data: { colorMode },
  } = useTheme();

  // NOTE: made to disable animation on page load
  useEffect(() => setAnimationTimeout(250), []);

  return (
    <IconButton
      edge="start"
      onClick={toggleColorMode}
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
      }}
    >
      <Zoom timeout={animationTimeout} in={colorMode === "light"}>
        <LightModeIcon sx={{ position: "absolute" }} />
      </Zoom>
      <Zoom timeout={animationTimeout} in={colorMode === "dark"}>
        <DarkModeIcon sx={{ position: "absolute" }} />
      </Zoom>
    </IconButton>
  );
}
