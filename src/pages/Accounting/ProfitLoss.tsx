"use client";

import React, { useEffect, useState } from "react";
import { getProfitLoss } from "../../services/accountingService";
import { Skeleton } from "../../components/ui/skeleton";
import "./ProfitLoss.css";

// ✅ Define Types
interface ProfitLossBreakdown {
  account_name: string;
  amount: number;
}

interface ProfitLossResponse {
  income_breakdown: ProfitLossBreakdown[];
  income_total: number;
  expense_breakdown: ProfitLossBreakdown[];
  expense_total: number;
  net_profit: number;
  status: "profit" | "loss" | "neutral";
}

const ProfitLoss: React.FC = () => {
  // ✅ Typed state
  const [report, setReport] = useState<ProfitLossResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getProfitLoss();
        setReport(data as ProfitLossResponse);
      } catch (err) {
        console.error("Failed to fetch profit/loss:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading || !report) {
    return (
      <div className="profitloss-page">
        <h2 className="profitloss-title">💰 Profit & Loss Statement</h2>
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="profitloss-page">
      <h2 className="profitloss-title">💰 Profit & Loss Statement</h2>

      {/* Income & Expense Cards */}
      <div className="profitloss-grid">
        {/* Income Section */}
        <div className="profitloss-card">
          <div className="profitloss-card-header">
            <h3 className="profitloss-card-title">Income</h3>
          </div>
          <div className="profitloss-card-content">
            <table className="profitloss-table">
              <tbody>
                {report.income_breakdown.map((item) => (
                  <tr key={item.account_name}>
                    <td>{item.account_name}</td>
                    <td className="text-right">₹ {item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="profitloss-total">
              Total: ₹ {report.income_total}
            </div>
          </div>
        </div>

        {/* Expense Section */}
        <div className="profitloss-card">
          <div className="profitloss-card-header">
            <h3 className="profitloss-card-title">Expenses</h3>
          </div>
          <div className="profitloss-card-content">
            <table className="profitloss-table">
              <tbody>
                {report.expense_breakdown.map((item) => (
                  <tr key={item.account_name}>
                    <td>{item.account_name}</td>
                    <td className="text-right">₹ {item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="profitloss-total">
              Total: ₹ {report.expense_total}
            </div>
          </div>
        </div>
      </div>

      {/* Net Result */}
      <div className="profitloss-result-card">
        <div className="profitloss-result">
          Net Result:&nbsp;
          <span
            className={
              report.status === "profit"
                ? "profitloss-profit"
                : report.status === "loss"
                ? "profitloss-loss"
                : "profitloss-neutral"
            }
          >
            ₹ {report.net_profit} ({report.status})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
