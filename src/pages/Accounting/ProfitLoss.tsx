// import React, { useEffect, useState } from "react";
// import { getProfitLoss } from "../../services/accountingService";
// import { ProfitLossResponse } from "../../types/accounting";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Skeleton } from "../../components/ui/skeleton";
// import "./ProfitLoss.css";


// const ProfitLoss: React.FC = () => {
//   const [report, setReport] = useState<ProfitLossResponse | null>(null);

//   useEffect(() => {
//     getProfitLoss().then(setReport);
//   }, []);

//   if (!report)
//     return (
//       <div className="p-6 space-y-3">
//         <h2 className="text-xl font-bold mb-4">💰 Profit & Loss Statement</h2>
//         <Skeleton className="h-32 w-full rounded-lg" />
//         <Skeleton className="h-32 w-full rounded-lg" />
//       </div>
//     );

//   const renderSection = (
//     title: string,
//     items: { account_name: string; amount: number }[],
//     total: number
//   ) => (
//     <Card className="shadow-md">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <table className="w-full border border-gray-200 text-sm mb-3 rounded-md overflow-hidden">
//           <tbody>
//             {items.map((item) => (
//               <tr key={item.account_name} className="hover:bg-gray-50">
//                 <td className="border p-2">{item.account_name}</td>
//                 <td className="border p-2 text-right">{item.amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="font-semibold text-right">Total: {total}</div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-xl font-bold">💰 Profit & Loss Statement</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {renderSection("Income", report.income_breakdown, report.income_total)}
//         {renderSection("Expenses", report.expense_breakdown, report.expense_total)}
//       </div>

//       <Card className="shadow-md">
//         <CardContent className="text-center p-6">
//           <div className="text-lg font-semibold">
//             Net Result:&nbsp;
//             <span
//               className={
//                 report.status === "profit"
//                   ? "text-green-600 font-bold"
//                   : report.status === "loss"
//                   ? "text-red-600 font-bold"
//                   : "text-gray-600"
//               }
//             >
//               {report.net_profit} ({report.status})
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ProfitLoss;


import React, { useEffect, useState } from "react";
import { getProfitLoss } from "../../services/accountingService";
import { Skeleton } from "../../components/ui/skeleton";
import "./ProfitLoss.css"; // Import the CSS

const ProfitLoss = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    getProfitLoss().then(setReport);
  }, []);

  if (!report)
    return (
      <div className="profitloss-page">
        <h2 className="profitloss-title">💰 Profit & Loss Statement</h2>
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );

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
                    <td className="text-right">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="profitloss-total">
              Total: {report.income_total}
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
                    <td className="text-right">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="profitloss-total">
              Total: {report.expense_total}
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
            {report.net_profit} ({report.status})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
