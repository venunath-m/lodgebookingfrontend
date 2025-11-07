"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts, createAccount } from "../../services/accountingService";
import { Account, AccountCreate } from "../../types/accounting";
import { ArrowLeft, Layout, PlusCircle } from "lucide-react";
import "./AccountsPage.css";

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
    <Layout>
    <div className="accounts-page">
      <div className="accounts-container">
        <Link to=".." relative="path" className="back-link">
          <ArrowLeft className="w-4 h-4" /> Back to Accounting Dashboard
        </Link>

        <div className="accounts-header">
          <h2>🏦 Chart of Accounts</h2>
          <p>Manage your organization's financial accounts and categories.</p>
        </div>

        <div className="add-account-card">
          <h3><PlusCircle className="w-5 h-5 text-indigo-600" /> Add New Account</h3>
          <form onSubmit={handleSubmit} className="add-account-form">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Account Name"
              required
            />
            <select
              value={form.account_type}
              onChange={(e) => setForm({ ...form, account_type: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="equity">Equity</option>
            </select>
            <button type="submit">Add</button>
          </form>
        </div>

        {loading ? (
          <p className="table-message">Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p className="table-message">No accounts found. Add your first one above.</p>
        ) : (
          <table className="accounts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, index) => (
                <tr key={acc.id}>
                  <td>{acc.id}</td>
                  <td>{acc.name}</td>
                  <td className="capitalize">{acc.account_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
     </Layout>
  );
};

export default AccountsPage;
