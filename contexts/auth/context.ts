import { createContext } from "react";
import { AuthContextDefaultValue } from "~/contexts/auth/types";

export const AuthContext = createContext<AuthContextDefaultValue | undefined>(undefined);
