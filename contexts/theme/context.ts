import { createContext } from "react";
import { ThemeContextDefaultValue } from "~/contexts/theme/types";

export const ThemeContext = createContext<ThemeContextDefaultValue | undefined>(undefined);
