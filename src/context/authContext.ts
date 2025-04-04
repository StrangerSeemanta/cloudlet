import { User } from "firebase/auth";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  loadingUser: boolean;
}
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loadingUser: true,
});
