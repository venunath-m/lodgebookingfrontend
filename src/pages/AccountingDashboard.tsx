// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Wallet,
//   BookOpen,
//   Scale,
//   BarChart3,
//   Calculator,
//   CalendarCheck,
// } from "lucide-react";

// const AccountingDashboard: React.FC = () => {
//   const modules = [
//     {
//       label: "Accounts",
//       path: "accounts",
//       icon: <Wallet className="w-8 h-8 text-indigo-600" />,
//       desc: "View and manage all accounts",
//     },
//     {
//       label: "Journal Entries",
//       path: "journals",
//       icon: <BookOpen className="w-8 h-8 text-blue-600" />,
//       desc: "Record daily transactions and ledgers",
//     },
//     {
//       label: "Trial Balance",
//       path: "trial-balance",
//       icon: <Scale className="w-8 h-8 text-teal-600" />,
//       desc: "Check the debit-credit balance",
//     },
//     {
//       label: "Profit & Loss",
//       path: "profit-loss",
//       icon: <BarChart3 className="w-8 h-8 text-green-600" />,
//       desc: "View income and expense reports",
//     },
//     {
//       label: "Balance Sheet",
//       path: "balance-sheet",
//       icon: <Calculator className="w-8 h-8 text-purple-600" />,
//       desc: "Assess company’s financial standing",
//     },
//     {
//       label: "Year End Process",
//       path: "year-end",
//       icon: <CalendarCheck className="w-8 h-8 text-pink-600" />,
//       desc: "Finalize and close financial year",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
//           📊 Accounting Dashboard
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Manage your company’s financial records, reports, and year-end
//           summaries all in one place.
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {modules.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-indigo-200 hover:-translate-y-1"
//             >
//               <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
//                 {item.icon}
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 mb-1">
//                 {item.label}
//               </h2>
//               <p className="text-gray-500 text-sm">{item.desc}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountingDashboard;


import React from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  BookOpen,
  Scale,
  BarChart3,
  Calculator,
  CalendarCheck,
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
  );
};

export default AccountingDashboard;
