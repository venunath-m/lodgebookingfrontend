import React from "react";
import { Link } from "react-router-dom";

const AccountingDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Accounting Dashboard</h1>
      <p className="mb-6 text-gray-600">
        Manage your financial records, journals, and reports here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Accounts", path: "/accounting/accounts" },
          { label: "Journal Entries", path: "/accounting/journals" },
          { label: "Trial Balance", path: "/accounting/trial-balance" },
          { label: "Profit & Loss", path: "/accounting/profit-loss" },
          { label: "Balance Sheet", path: "/accounting/balance-sheet" },
          { label: "Year End Process", path: "/accounting/year-end" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block bg-indigo-100 hover:bg-indigo-200 p-4 rounded-lg text-center text-lg font-semibold shadow"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountingDashboard;
