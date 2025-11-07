// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getBalanceSheet } from "../../services/accountingService";
// import { BalanceSheetResponse } from "../../types/accounting";
// import { ArrowLeft, Banknote, Scale, TrendingUp } from "lucide-react";

// const BalanceSheet: React.FC = () => {
//   const [data, setData] = useState<BalanceSheetResponse | null>(null);

//   useEffect(() => {
//     getBalanceSheet().then(setData);
//   }, []);

//   if (!data)
//     return (
//       <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
//         Loading balance sheet...
//       </div>
//     );

//   const renderSection = (
//     title: string,
//     icon: React.ReactNode,
//     items: { account_name: string; amount: number }[]
//   ) => (
//     <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">
//       <div className="flex items-center gap-2 mb-3">
//         {icon}
//         <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
//       </div>
//       <table className="w-full border-collapse">
//         <tbody>
//           {items.map((item) => (
//             <tr
//               key={item.account_name}
//               className="border-t border-gray-100 hover:bg-indigo-50 transition"
//             >
//               <td className="py-2 text-gray-700">{item.account_name}</td>
//               <td className="py-2 text-right font-medium text-gray-800">
//                 ₹{item.amount.toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* 🔹 Back Link */}
//         <div className="mb-6">
//           <Link
//             to=".."
//             relative="path"
//             className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-1" /> Back to Accounting Dashboard
//           </Link>
//         </div>

//         {/* 🔹 Title */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scale className="w-7 h-7 text-indigo-600" /> Balance Sheet
//           </h2>
//           <p className="text-gray-600 mt-1">
//             Overview of your organization’s financial position.
//           </p>
//         </div>

//         {/* 🔹 Assets / Liabilities & Equity */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {renderSection(
//             "Assets",
//             <Banknote className="w-5 h-5 text-green-600" />,
//             data.assets
//           )}
//           <div className="flex flex-col gap-6">
//             {renderSection(
//               "Liabilities",
//               <TrendingUp className="w-5 h-5 text-red-600" />,
//               data.liabilities
//             )}
//             {renderSection(
//               "Equity",
//               <TrendingUp className="w-5 h-5 text-indigo-600" />,
//               data.equity
//             )}
//           </div>
//         </div>

//         {/* 🔹 Summary */}
//         <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-gray-800 flex flex-col sm:flex-row justify-between items-center">
//           <div className="text-lg font-semibold">
//             Total Assets:{" "}
//             <span className="text-indigo-700">
//               ₹{data.total_assets.toLocaleString()}
//             </span>
//           </div>

//           <div className="text-lg font-semibold mt-2 sm:mt-0">
//             Total Liabilities + Equity:{" "}
//             <span className="text-indigo-700">
//               ₹{(data.total_liabilities + data.total_equity).toLocaleString()}
//             </span>
//           </div>

//           <div
//             className={`mt-3 sm:mt-0 text-sm font-bold px-3 py-1 rounded-full ${
//               data.is_balanced
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {data.is_balanced ? "✅ Balanced" : "⚠️ Not Balanced"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalanceSheet;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBalanceSheet } from "../../services/accountingService";
import { BalanceSheetResponse } from "../../types/accounting";
import { ArrowLeft, Banknote, Scale, TrendingUp } from "lucide-react";
import "./BalanceSheet.css";

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
  );
};

export default BalanceSheet;
