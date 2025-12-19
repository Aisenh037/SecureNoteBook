import { createContext, useContext, useEffect, useState } from "react";
import { fetchProfile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginSuccess = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setLoading(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile(token)
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, loginSuccess, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
