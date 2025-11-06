import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts, createAccount } from "../../services/accountingService";
import { Account, AccountCreate } from "../../types/accounting";
import { ArrowLeft, PlusCircle } from "lucide-react";

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<AccountCreate>({
    name: "",
    account_type: "",
  });
  const [loading, setLoading] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    const data = await getAccounts();
    setAccounts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount(form);
    setForm({ name: "", account_type: "" });
    loadAccounts();
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
    //   <div className="max-w-5xl mx-auto p-6"> 
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-10">
  <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md">
        {/* 🔹 Back Link */}
        <div className="mb-6" >
          <Link
            to=".."
            relative="path"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Accounting Dashboard
          </Link>
        </div>

        {/* 🔹 Page Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🏦 Chart of Accounts
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your organization's financial accounts and categories.
        </p>

        {/* 🔹 Add Account Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            Add New Account
          </h3>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Account Name"
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg px-4 py-2 w-full sm:w-1/3 transition"
              required
            />

            <select
              value={form.account_type}
              onChange={(e) =>
                setForm({ ...form, account_type: e.target.value })
              }
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg px-4 py-2 w-full sm:w-1/3 transition"
              required
            >
              <option value="">Select Type</option>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="equity">Equity</option>
            </select>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2 transition-all shadow-sm"
            >
              Add
            </button>
          </form>
        </div>

        {/* 🔹 Accounts Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="text-center p-6 text-gray-500">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-center p-6 text-gray-500">
              No accounts found. Add your first one above.
            </p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-indigo-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, index) => (
                  <tr
                    key={acc.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    } hover:bg-indigo-100 transition`}
                  >
                    <td className="px-4 py-2 border-t border-gray-100 text-sm text-gray-700">
                      {acc.id}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-100 text-sm text-gray-800">
                      {acc.name}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-100 text-sm text-gray-600 capitalize">
                      {acc.account_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
