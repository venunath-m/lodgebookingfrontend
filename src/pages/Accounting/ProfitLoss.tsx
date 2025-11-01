import React, { useEffect, useState } from "react";
import { getProfitLoss } from "../../services/accountingServices";
import { ProfitLossResponse } from "../../types/accounting";

const ProfitLoss: React.FC = () => {
  const [report, setReport] = useState<ProfitLossResponse | null>(null);

  useEffect(() => {
    getProfitLoss().then(setReport);
  }, []);

  if (!report) return <div className="p-6">Loading profit & loss report...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">💰 Profit & Loss Statement</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Income</h3>
          <table className="w-full border mb-4">
            <tbody>
              {report.income_breakdown.map((item) => (
                <tr key={item.account_name}>
                  <td className="border p-2">{item.account_name}</td>
                  <td className="border p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="font-bold">Total Income: {report.income_total}</div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Expenses</h3>
          <table className="w-full border mb-4">
            <tbody>
              {report.expense_breakdown.map((item) => (
                <tr key={item.account_name}>
                  <td className="border p-2">{item.account_name}</td>
                  <td className="border p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="font-bold">Total Expense: {report.expense_total}</div>
        </div>
      </div>

      <div className="mt-6 text-lg font-bold">
        Net Result:{" "}
        <span
          className={
            report.status === "profit"
              ? "text-green-600"
              : report.status === "loss"
              ? "text-red-600"
              : "text-gray-600"
          }
        >
          {report.net_profit} ({report.status})
        </span>
      </div>
    </div>
  );
};

export default ProfitLoss;
