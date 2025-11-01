"use client";
import type { ReactNode } from "react";
import "./NewFloatingStyles.css";

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
        padding: "2rem",
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden", // for floating shapes
      }}
    >
      {/* Floating shapes behind the card */}
      <div className="shape-circle large"></div>
      <div className="shape-circle medium"></div>
      <div className="shape-circle small"></div>

      {/* Card */}
      <div className="section-gradient card-floating highlight-glow" style={{ maxWidth: "400px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

