"use client";
import React from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  BookOpen,
  Scale,
  BarChart3,
  Calculator,
  CalendarCheck,
  Layout,
} from "lucide-react";
import "./AccountingDashboard.css";

const AccountingDashboard: React.FC = () => {
  const modules = [
    { label: "Accounts", path: "accounts", icon: <Wallet className="w-8 h-8 text-indigo-600" />, desc: "View and manage all accounts" },
    { label: "Journal Entries", path: "journals", icon: <BookOpen className="w-8 h-8 text-blue-600" />, desc: "Record daily transactions and ledgers" },
    { label: "Trial Balance", path: "trial-balance", icon: <Scale className="w-8 h-8 text-teal-600" />, desc: "Check the debit-credit balance" },
    { label: "Profit & Loss", path: "profit-loss", icon: <BarChart3 className="w-8 h-8 text-green-600" />, desc: "View income and expense reports" },
    { label: "Balance Sheet", path: "balance-sheet", icon: <Calculator className="w-8 h-8 text-purple-600" />, desc: "Assess company’s financial standing" },
    { label: "Year End Process", path: "year-end", icon: <CalendarCheck className="w-8 h-8 text-pink-600" />, desc: "Finalize and close financial year" },
  ];

  return (
    <Layout>
    <div className="accounting-dashboard">
      <div className="container">
        <h1>📊 Accounting Dashboard</h1>
        <p className="subtitle">
          Manage your company’s financial records, reports, and year-end summaries all in one place.
        </p>

        <div className="dashboard-grid">
          {modules.map((item) => (
            <Link key={item.path} to={item.path} className="dashboard-card">
              <div className="icon">{item.icon}</div>
              <h2>{item.label}</h2>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default AccountingDashboard;
