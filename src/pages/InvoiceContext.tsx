// src/context/InvoiceContext.tsx
import React, { createContext, useContext, useState } from "react";

interface InvoiceContextType {
  invoice: any;
  setInvoice: (inv: any) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoice, setInvoice] = useState<any>(null);

  return (
    <InvoiceContext.Provider value={{ invoice, setInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error("useInvoice must be used within InvoiceProvider");
  return context;
};
