import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/client";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Vérifier le token et récupérer l'utilisateur
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data.user);
        setToken(storedToken);
    } catch {
      // Token invalide → on nettoie
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);

    return userData;
  }, []);

  const adminLogin = useCallback(async (accessCode) => {
    const response = await api.post("/auth/admin-access", { access_code: accessCode });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  }, []);

  // Register
  const register = useCallback(async (data) => {
    const response = await api.post("/auth/register", data);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);

    return userData;
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    await api.post("/auth/forgot-password", { email });
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  // Update user (après modification du profil)
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    adminLogin,
    register,
    forgotPassword,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
