import { createContext, useContext, useEffect, useState } from "react";
import fetchApi from "../more/fetchApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let res = await fetchApi("/auth/me", "GET", null, { unRedirect: true });
        if (res.ok) {
          setUser(res.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)
