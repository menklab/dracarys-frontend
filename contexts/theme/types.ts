import { Theme } from "@mui/material";
import { ReactNode } from "react";
import { LayoutColorMode } from "~/types/layout";

export interface ThemeContextActions {
  toggleColorMode: () => void;
}

export interface ThemeContextData {
  colorMode: LayoutColorMode;
  theme: Theme;
}

export interface ThemeContextDefaultValue {
  actions: ThemeContextActions;
  data: ThemeContextData;
}

export interface ThemeProviderProps {
  defaultColorMode: LayoutColorMode;
  children: ReactNode;
}
