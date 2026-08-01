import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axiosInstance";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Cek profile untuk validasi token
      api
        .get("/auth/profile")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("accessToken");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, user: userData } = response.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
    return userData;
  };
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    const { accessToken, user: userData } = response.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
    return userData;
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
