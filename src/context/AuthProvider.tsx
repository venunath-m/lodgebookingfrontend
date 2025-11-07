import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType, User } from "../types/index";
import axios from "axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [user, setUser] = useState<User | null>(null); // ✅ added user
  const [loading, setLoading] = useState(true);

  // Load from storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as "user" | "admin" | null;
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  // Save to storage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Attach token to axios
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) config.headers.Authorization = `Bearer ${storedToken}`;
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const value: AuthContextType = { token, setToken, role, setRole, loading, user, setUser }; // ✅ include user

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
