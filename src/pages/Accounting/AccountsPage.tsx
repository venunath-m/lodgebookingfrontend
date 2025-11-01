import React, { useEffect, useState } from "react";
import { getAccounts, createAccount } from "../../services/accountingService";
import { Account, AccountCreate } from "../../types/accounting";

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<AccountCreate>({ name: "", account_type: "" });
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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">🏦 Chart of Accounts</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Account Name"
          className="border p-2 rounded w-1/3"
          required
        />
        <select
          value={form.account_type}
          onChange={(e) => setForm({ ...form, account_type: e.target.value })}
          className="border p-2 rounded w-1/3"
          required
        >
          <option value="">Select Type</option>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="equity">Equity</option>
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading accounts...</p>
      ) : (
        <table className="w-full border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td className="border p-2">{acc.id}</td>
                <td className="border p-2">{acc.name}</td>
                <td className="border p-2 capitalize">{acc.account_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountsPage;
