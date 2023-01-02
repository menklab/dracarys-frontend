import { createContext } from "react";
import { AuthContextDefaultValue } from "./types";

export const AuthContext = createContext<AuthContextDefaultValue | undefined>(undefined);
