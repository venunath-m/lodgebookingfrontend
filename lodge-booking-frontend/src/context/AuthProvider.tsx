"use client"
import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "../types/index";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<"user" | "admin" | null>(localStorage.getItem("role") as "user" | "admin" | null);

  const value: AuthContextType = { token, setToken, role, setRole };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
