import { ThemeOptions } from "@mui/material/styles";
import { Roboto } from "@next/font/google";
import { LayoutColorMode } from "~/types/layout";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const getDesignTokens = (mode: LayoutColorMode): ThemeOptions => ({
  palette: { mode },
  typography: { fontFamily: roboto.style.fontFamily },
});
