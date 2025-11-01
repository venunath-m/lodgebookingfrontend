import React, { useEffect, useState } from "react";
import { getBalanceSheet } from "../../services/accountingServices";
import { BalanceSheetResponse } from "../../types/accounting";

const BalanceSheet: React.FC = () => {
  const [data, setData] = useState<BalanceSheetResponse | null>(null);

  useEffect(() => {
    getBalanceSheet().then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading balance sheet...</div>;

  const renderSection = (title: string, items: { account_name: string; amount: number }[]) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <table className="w-full border mb-2">
        <tbody>
          {items.map((item) => (
            <tr key={item.account_name}>
              <td className="border p-2">{item.account_name}</td>
              <td className="border p-2 text-right">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 Balance Sheet</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>{renderSection("Assets", data.assets)}</div>
        <div>
          {renderSection("Liabilities", data.liabilities)}
          {renderSection("Equity", data.equity)}
        </div>
      </div>

      <div className="mt-6 text-lg font-bold">
        Total Assets: {data.total_assets} | Total Liabilities + Equity:{" "}
        {data.total_liabilities + data.total_equity}
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

export default BalanceSheet;
