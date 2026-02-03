import { createContext, useContext, useEffect, useState } from "react";
import { verifyAuth, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
  });

  const refreshAuth = async () => {
    try {
      const data = await verifyAuth();

      if (data.authenticated) {
        setAuth({
          user: {
            username: data.username,
            email: data.email,
            role: data.role,
          },
          isAuthenticated: true,
          isAdmin: data.role === "ADMIN",
          loading: false,
        });
      } else {
        setAuth({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          loading: false,
        });
      }
    } catch (err) {
      setAuth({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
      });
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setAuth({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
