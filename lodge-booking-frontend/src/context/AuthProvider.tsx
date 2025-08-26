"use client"
import  { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "../types/index";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const value: AuthContextType = { token, setToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
