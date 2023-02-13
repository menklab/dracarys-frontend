import { useContext } from "react";
import { ThemeContext } from "~/contexts/theme/context";

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (theme === undefined) throw new Error("Cannot use theme context");
  return theme;
};
