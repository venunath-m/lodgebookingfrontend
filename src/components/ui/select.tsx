import React, { useState, useRef, useEffect } from "react";

// ✅ Props for the full Select component
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

// ✅ Main Select wrapper with dropdown logic
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Provide context for children to access `value`, `onValueChange`, and `setOpen`
  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              open,
              setOpen,
              value,
              onValueChange,
            })
          : child
      )}
    </div>
  );
};

// ✅ Trigger button
export const SelectTrigger: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean; setOpen?: (v: boolean) => void }
> = ({ className = "", children, setOpen, open, ...props }) => (
  <button
    type="button"
    onClick={() => setOpen?.(!open)}
    className={`w-full flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  >
    {children}
    <span className="ml-2 text-gray-500">▼</span>
  </button>
);

// ✅ Placeholder or selected value
export const SelectValue: React.FC<{ placeholder?: string; value?: string }> = ({
  placeholder,
  value,
}) => (
  <span className="text-gray-700">{value || placeholder || "Select..."}</span>
);

// ✅ Dropdown content container
export const SelectContent: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    setOpen?: (v: boolean) => void;
  }
> = ({ className = "", children, open, ...props }) =>
  open ? (
    <div
      className={`absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  ) : null;

// ✅ Individual item
export const SelectItem: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
    onValueChange?: (v: string) => void;
    setOpen?: (v: boolean) => void;
  }
> = ({ className = "", children, value, onValueChange, setOpen, ...props }) => (
  <div
    onClick={() => {
      onValueChange?.(value);
      setOpen?.(false);
    }}
    className={`cursor-pointer px-3 py-2 hover:bg-indigo-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);
