import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrialBalance } from "../../services/accountingService";
import { TrialBalanceResponse } from "../../types/accounting";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const TrialBalance: React.FC = () => {
  const [data, setData] = useState<TrialBalanceResponse | null>(null);

  useEffect(() => {
    getTrialBalance().then(setData);
  }, []);

  if (!data)
    return (
      <div className="p-6 space-y-3">
        <Link
          to=".."
          relative="path"
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <ArrowLeft size={16} /> Back to Accounting Dashboard
        </Link>
        <h2 className="text-xl font-bold mb-4">📘 Trial Balance</h2>
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-10 w-1/2 rounded-lg" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Back Link */}
      <Link
        to=".."
        relative="path"
        className="flex items-center gap-1 text-indigo-600 hover:underline text-sm mb-2"
      >
        <ArrowLeft size={16} /> Back to Accounting Dashboard
      </Link>

      <h2 className="text-xl font-bold">📘 Trial Balance</h2>

      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-md overflow-hidden text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-2 text-left">Account</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-right">Debit</th>
                  <th className="border p-2 text-right">Credit</th>
                  <th className="border p-2 text-right">Net Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.trial_balance.map((row) => (
                  <tr
                    key={row.account_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
          </div>

          <div className="mt-6 flex items-center justify-between text-lg font-semibold">
            <div>
              Total Debit:{" "}
              <span className="text-blue-700">{data.total_debit}</span> | Total
              Credit: <span className="text-blue-700">{data.total_credit}</span>
            </div>
            <div
              className={`${
                data.is_balanced ? "text-green-600" : "text-red-600"
              } font-bold`}
            >
              {data.is_balanced ? "✅ Balanced" : "⚠️ Not Balanced"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialBalance;
