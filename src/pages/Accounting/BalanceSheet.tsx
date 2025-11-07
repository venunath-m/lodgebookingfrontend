"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBalanceSheet } from "../../services/accountingService";
import { BalanceSheetResponse } from "../../types/accounting";
import { ArrowLeft, Banknote, Scale, TrendingUp } from "lucide-react";
import "./BalanceSheet.css";
import DashboardLayout from "../../components/DashboardLayout";

const BalanceSheet: React.FC = () => {
  const [data, setData] = useState<BalanceSheetResponse | null>(null);

  useEffect(() => {
    getBalanceSheet().then(setData);
  }, []);

  if (!data)
    return (
      <div className="balancesheet-page flex items-center justify-center h-64 text-gray-500 text-lg">
        Loading balance sheet...
      </div>
    );

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: { account_name: string; amount: number }[]
  ) => (
    <div className="balancesheet-card">
      <div className="balancesheet-card-header">
        {icon}
        <h3 className="balancesheet-card-title">{title}</h3>
      </div>
      <table className="balancesheet-table">
        <tbody>
          {items.map((item) => (
            <tr key={item.account_name}>
              <td>{item.account_name}</td>
              <td className="text-right">₹{item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
     <DashboardLayout>
    <div className="balancesheet-page">
      {/* Back Link */}
      <Link to=".." className="balancesheet-back-link">
        <ArrowLeft size={16} className="mr-1" /> Back to Accounting Dashboard
      </Link>

      {/* Page Title */}
      <h2 className="balancesheet-title">
        <Scale className="w-7 h-7 text-indigo-600" /> Balance Sheet
      </h2>
      <p className="balancesheet-subtitle">
        Overview of your organization’s financial position.
      </p>

      {/* Assets / Liabilities & Equity */}
      <div className="balancesheet-grid">
        {renderSection("Assets", <Banknote className="w-5 h-5 text-green-600" />, data.assets)}

        <div className="balancesheet-right-column">
          {renderSection(
            "Liabilities",
            <TrendingUp className="w-5 h-5 text-red-600" />,
            data.liabilities
          )}
          {renderSection(
            "Equity",
            <TrendingUp className="w-5 h-5 text-indigo-600" />,
            data.equity
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="balancesheet-summary">
        <div>Total Assets: <span className="text-indigo-700">₹{data.total_assets.toLocaleString()}</span></div>
        <div>Total Liabilities + Equity: <span className="text-indigo-700">₹{(data.total_liabilities + data.total_equity).toLocaleString()}</span></div>
        <div className={`balancesheet-balanced ${data.is_balanced ? "success" : "error"}`}>
          {data.is_balanced ? "✅ Balanced" : "⚠️ Not Balanced"}
        </div>
      </div>
    </div>
     </DashboardLayout>
  );
};

export default BalanceSheet;
