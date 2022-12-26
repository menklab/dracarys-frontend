import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "@next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const theme = createTheme({
  palette: {
    primary: { main: "#282828" },
    secondary: { main: "#D9D9D9" },
    text: { primary: "#000000", secondary: "#2C2C2C", disabled: "#9F9F9F" },
    divider: "#E5E5E5",
    error: { main: red.A400 },
    background: { default: "#FFFFFF" },
  },
  typography: { fontFamily: roboto.style.fontFamily },
});

export default theme;
