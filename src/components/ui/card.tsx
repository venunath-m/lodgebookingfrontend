import React from "react";

// 🟢 Base Card wrapper
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

// 🟢 Header section (usually for titles)
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`border-b p-4 ${className}`} {...props}>
    {children}
  </div>
);

// 🟢 Title inside header
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

// 🟢 Content area (main body)
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);
