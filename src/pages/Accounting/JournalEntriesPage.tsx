// import React, { useEffect, useState } from "react";
// import "./JournalEntriesPage.css";
// import {
//   getJournalEntries,
//   createJournalEntry,
//   getAccounts,
// } from "../../services/accountingService";
// import {
//   JournalEntry,
//   JournalEntryCreate,
//   Account,
// } from "../../types/accounting";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Button } from "../../components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// const JournalEntriesPage: React.FC = () => {
//   const [entries, setEntries] = useState<JournalEntry[]>([]);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [form, setForm] = useState<JournalEntryCreate>({
//     account_id: 0,
//     entry_type: "debit",
//     amount: 0,
//     description: "",
//   });

//   const loadData = async () => {
//     const [entriesData, accountsData] = await Promise.all([
//       getJournalEntries(),
//       getAccounts(),
//     ]);
//     setEntries(entriesData);
//     setAccounts(accountsData);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.account_id || !form.amount) return;
//     await createJournalEntry(form);
//     setForm({ account_id: 0, entry_type: "debit", amount: 0, description: "" });
//     loadData();
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle>🧾 Add Journal Entry</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-wrap gap-3 items-center"
//           >
//             <Select
//               value={form.account_id.toString()}
//               onValueChange={(val) =>
//                 setForm({ ...form, account_id: Number(val) })
//               }
//             >
//               <SelectTrigger className="w-56">
//                 <SelectValue placeholder="Select Account" />
//               </SelectTrigger>
//               <SelectContent>
//                 {accounts.map((acc) => (
//                   <SelectItem key={acc.id} value={acc.id.toString()}>
//                     {acc.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               value={form.entry_type}
//               onValueChange={(val) =>
//                 setForm({ ...form, entry_type: val as "debit" | "credit" })
//               }
//             >
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Entry Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="debit">Debit</SelectItem>
//                 <SelectItem value="credit">Credit</SelectItem>
//               </SelectContent>
//             </Select>

//             <Input
//               type="number"
//               placeholder="Amount"
//               value={form.amount || ""}
//               onChange={(e) =>
//                 setForm({ ...form, amount: Number(e.target.value) })
//               }
//               className="w-40"
//             />

//             <Input
//               type="text"
//               placeholder="Description"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               className="flex-grow"
//             />

//             <Button type="submit" className="bg-indigo-600 text-white">
//               Add Entry
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle>📘 Journal Entries List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
//               <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//                 <tr>
//                   <th className="border p-2 text-left">Date</th>
//                   <th className="border p-2 text-left">Account</th>
//                   <th className="border p-2 text-left">Type</th>
//                   <th className="border p-2 text-left">Amount</th>
//                   <th className="border p-2 text-left">Description</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {entries.map((e) => (
//                   <tr key={e.id} className="hover:bg-gray-50">
//                     <td className="border p-2">{e.date}</td>
//                     <td className="border p-2">
//                       {accounts.find((a) => a.id === e.account_id)?.name}
//                     </td>
//                     <td className="border p-2 capitalize">{e.entry_type}</td>
//                     <td className="border p-2">{e.amount}</td>
//                     <td className="border p-2">{e.description}</td>
//                   </tr>
//                 ))}
//                 {entries.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="text-center text-gray-500 p-4 italic"
//                     >
//                       No journal entries yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default JournalEntriesPage;


import React, { useEffect, useState } from "react";
import "./JournalEntriesPage.css";
import {
  getJournalEntries,
  createJournalEntry,
  getAccounts,
} from "../../services/accountingService";
import {
  JournalEntry,
  JournalEntryCreate,
  Account,
} from "../../types/accounting";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

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
    const [entriesData, accountsData] = await Promise.all([
      getJournalEntries(),
      getAccounts(),
    ]);
    setEntries(entriesData);
    setAccounts(accountsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.account_id || !form.amount) return;
    await createJournalEntry(form);
    setForm({ account_id: 0, entry_type: "debit", amount: 0, description: "" });
    loadData();
  };

  return (
    <div className="journal-page">
  <div className="journal-card">
    <div className="journal-card-header">
      <h2>🧾 Add Journal Entry</h2>
    </div>
    <form onSubmit={handleSubmit} className="journal-form">
            <Select
              value={form.account_id.toString()}
              onValueChange={(val) =>
                setForm({ ...form, account_id: Number(val) })
              }
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id.toString()}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={form.entry_type}
              onValueChange={(val) =>
                setForm({ ...form, entry_type: val as "debit" | "credit" })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Amount"
              value={form.amount || ""}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
              className="w-40"
            />

            <Input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="flex-grow"
            />

            <Button type="submit" className="bg-indigo-600 text-white">
              Add Entry
            </Button>
          </form>
          </div>

      <div className="journal-card">
    <div className="journal-card-header">
      <h2>📘 Journal Entries List</h2>
    </div>
    <div className="journal-table-container">
      <table className="journal-table">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Account</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Amount</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="border p-2">{e.date}</td>
                    <td className="border p-2">
                      {accounts.find((a) => a.id === e.account_id)?.name}
                    </td>
                    <td className="border p-2 capitalize">{e.entry_type}</td>
                    <td className="border p-2">{e.amount}</td>
                    <td className="border p-2">{e.description}</td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-500 p-4 italic"
                    >
                      No journal entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
    </div>
  </div>
</div>
  );
};

export default JournalEntriesPage;
