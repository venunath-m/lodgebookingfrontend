"use client";
import type { ReactNode } from "react";

interface CenteredLayoutProps {
  children: ReactNode;
}

export default function CenteredLayout({ children }: CenteredLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        width: "100%",
        boxSizing: "border-box",
        background: "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >
      {children}
    </div>
  );
}
