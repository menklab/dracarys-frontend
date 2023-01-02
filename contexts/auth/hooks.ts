import { useContext } from "react";
import { AuthContext } from "./context";

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined) throw new Error("Cannot use auth context");
  return auth;
};
