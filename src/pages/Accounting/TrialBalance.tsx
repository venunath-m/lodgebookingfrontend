import React, { useEffect, useState } from "react";
import { getTrialBalance } from "../../services/accountingServices";
import { TrialBalanceResponse } from "../../types/accounting";

const TrialBalance: React.FC = () => {
  const [data, setData] = useState<TrialBalanceResponse | null>(null);

  useEffect(() => {
    getTrialBalance().then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading trial balance...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📘 Trial Balance</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Account</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Debit</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Net Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.trial_balance.map((row) => (
            <tr key={row.account_id}>
              <td className="border p-2">{row.account_name}</td>
              <td className="border p-2 capitalize">{row.account_type}</td>
              <td className="border p-2 text-right">{row.debit_total}</td>
              <td className="border p-2 text-right">{row.credit_total}</td>
              <td className="border p-2 text-right font-semibold">
                {row.net_balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 font-bold text-lg">
        Total Debit: {data.total_debit} | Total Credit: {data.total_credit}
        <span
          className={`ml-4 ${
            data.is_balanced ? "text-green-600" : "text-red-600"
          }`}
        >
          {data.is_balanced ? "✅ Balanced" : "⚠️ Not Balanced"}
        </span>
      </div>
    </div>
  );
};

export default TrialBalance;
