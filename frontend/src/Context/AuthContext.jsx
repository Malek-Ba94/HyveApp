import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("hyve-user");
    return raw ? JSON.parse(raw) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // synchronisé local storage(state)
  useEffect(() => {
    if (user) {
      localStorage.setItem("hyve-user", JSON.stringify(user));
      localStorage.setItem("hyve-connected", "true");
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("hyve-user");
      localStorage.removeItem("hyve-connected");
      setIsAuthenticated(false);
    }
  }, [user]);

  // connexion
  const login = (payload) => {
    setUser(payload);
    setIsAuthenticated(true);
  };

  // déconnexion
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
