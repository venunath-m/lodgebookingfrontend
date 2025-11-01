"use client";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "../types/index";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ keep token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // ✅ keep role in localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  // ✅ load token & role from storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as "user" | "admin" | null;

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);

    setLoading(false); // auth state is ready
  }, []);

  const value: AuthContextType = { token, setToken, role, setRole, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
