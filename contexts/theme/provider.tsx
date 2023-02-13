import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import cookie from "js-cookie";
import { useMemo, useState } from "react";
import { LAYOUT_DEFAULT_COLOR_MODE } from "~/constants/layout";
import { LayoutColorMode } from "~/types/layout";
import { getDesignTokens } from "~/utils/muiTheme";
import { ThemeContext } from "./context";
import { ThemeContextActions, ThemeProviderProps } from "./types";

export default function ThemeProvider({ defaultColorMode, children }: ThemeProviderProps) {
  const [mode, setMode] = useState<LayoutColorMode>(
    defaultColorMode || (cookie.get("theme") as LayoutColorMode) || LAYOUT_DEFAULT_COLOR_MODE
  );

  const actions: ThemeContextActions = {
    toggleColorMode: () => {
      const newColorMode = mode === "light" ? "dark" : "light";
      cookie.set("colorMode", newColorMode);
      setMode(newColorMode);
    },
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ actions, data: { colorMode: mode, theme } }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
