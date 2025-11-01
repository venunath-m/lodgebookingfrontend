// DevOnly.tsx
import React from "react";

const DevOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This condition will be removed completely in production
  if (import.meta.env.VITE_IS_DEV !== "true") return null;
  return <>{children}</>;
};

export default DevOnly;
