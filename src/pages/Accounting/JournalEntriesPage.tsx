import React, { useEffect, useState } from "react";
import { getJournalEntries, createJournalEntry, getAccounts } from "../../services/accountingService";
import { JournalEntry, JournalEntryCreate, Account } from "../../types/accounting";

const JournalEntriesPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<JournalEntryCreate>({
    account_id: 0,
    entry_type: "debit",
    amount: 0,
    description: "",
  });

  const loadData = async () => {
    const [entriesData, accountsData] = await Promise.all([getJournalEntries(), getAccounts()]);
    setEntries(entriesData);
    setAccounts(accountsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJournalEntry(form);
    loadData();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">🧾 Journal Entries</h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
        <select
          value={form.account_id}
          onChange={(e) => setForm({ ...form, account_id: Number(e.target.value) })}
          className="border p-2 rounded w-1/5"
        >
          <option value={0}>Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <select
          value={form.entry_type}
          onChange={(e) => setForm({ ...form, entry_type: e.target.value as "debit" | "credit" })}
          className="border p-2 rounded w-1/5"
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          className="border p-2 rounded w-1/5"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded flex-grow"
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add Entry</button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Account</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="border p-2">{e.date}</td>
              <td className="border p-2">{accounts.find((a) => a.id === e.account_id)?.name}</td>
              <td className="border p-2 capitalize">{e.entry_type}</td>
              <td className="border p-2">{e.amount}</td>
              <td className="border p-2">{e.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalEntriesPage;
