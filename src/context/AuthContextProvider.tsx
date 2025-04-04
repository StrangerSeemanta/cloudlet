import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./authContext";

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user: user, loadingUser: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
