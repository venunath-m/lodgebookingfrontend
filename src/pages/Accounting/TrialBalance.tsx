"use client";


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrialBalance } from "../../services/accountingService";
import { TrialBalanceResponse } from "../../types/accounting";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import "./TrialBalance.css";

const TrialBalance: React.FC = () => {
  const [data, setData] = useState<TrialBalanceResponse | null>(null);

  useEffect(() => {
    getTrialBalance().then(setData);
  }, []);

  if (!data)
    return (
      <div className="trial-page">
        <Link
          to=".."
          relative="path"
          className="trial-back-link"
        >
          <ArrowLeft size={16} /> Back to Accounting Dashboard
        </Link>
        <h2 className="trial-title">📘 Trial Balance</h2>
        <div className="trial-card trial-skeleton" style={{ height: "200px" }}></div>
        <div className="trial-card trial-skeleton" style={{ height: "40px", width: "50%" }}></div>
      </div>
    );

  return (
    <div className="trial-page">
      {/* 🔹 Back Link */}
      <Link
        to=".."
        relative="path"
        className="trial-back-link"
      >
        <ArrowLeft size={16} /> Back to Accounting Dashboard
      </Link>

      {/* 🔹 Title */}
      <h2 className="trial-title">📘 Trial Balance</h2>

      {/* 🔹 Card */}
      <div className="trial-card">
        <div className="trial-card-content">
          {/* 🔹 Table */}
          <div className="trial-table-container">
            <table className="trial-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Type</th>
                  <th className="text-right">Debit</th>
                  <th className="text-right">Credit</th>
                  <th className="text-right">Net Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.trial_balance.map((row) => (
                  <tr key={row.account_id}>
                    <td>{row.account_name}</td>
                    <td className="capitalize">{row.account_type}</td>
                    <td className="text-right">{row.debit_total}</td>
                    <td className="text-right">{row.credit_total}</td>
                    <td className="text-right font-semibold">
                      {row.net_balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Summary */}
          <div className="trial-summary">
            <div className="totals">
              Total Debit: <span>{data.total_debit}</span> | Total Credit:{" "}
              <span>{data.total_credit}</span>
            </div>
            <div
              className={`status ${
                data.is_balanced ? "balanced" : "unbalanced"
              }`}
            >
              {data.is_balanced ? "✅ Balanced" : "⚠️ Not Balanced"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
