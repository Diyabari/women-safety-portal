import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("wsp_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("wsp_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem("wsp_user", JSON.stringify(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem("wsp_token");
        localStorage.removeItem("wsp_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { user: loggedInUser, token } = res.data.data;
    localStorage.setItem("wsp_token", token);
    localStorage.setItem("wsp_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    const { user: newUser, token } = res.data.data;
    localStorage.setItem("wsp_token", token);
    localStorage.setItem("wsp_user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("wsp_token");
    localStorage.removeItem("wsp_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
