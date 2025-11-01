export interface Account {
  id: number;
  name: string;
  account_type: string;
}

export interface AccountCreate {
  name: string;
  account_type: string;
}

export type EntryType = "debit" | "credit";

export interface JournalEntry {
  id: number;
  account_id: number;
  entry_type: EntryType;
  amount: number;
  description?: string;
  date: string;
}

export interface JournalEntryCreate {
  account_id: number;
  entry_type: EntryType;
  amount: number;
  description?: string;
}

export interface TrialBalanceRow {
  account_id: number;
  account_name: string;
  account_type: string;
  debit_total: number;
  credit_total: number;
  net_balance: number;
}

export interface TrialBalanceResponse {
  trial_balance: TrialBalanceRow[];
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
}

export interface ProfitLossResponse {
  income_total: number;
  expense_total: number;
  net_profit: number;
  income_breakdown: { account_name: string; amount: number }[];
  expense_breakdown: { account_name: string; amount: number }[];
  status: "profit" | "loss" | "break-even";
}

export interface BalanceSheetResponse {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  is_balanced: boolean;
  assets: { account_name: string; entry_type: EntryType; amount: number }[];
  liabilities: { account_name: string; entry_type: EntryType; amount: number }[];
  equity: { account_name: string; entry_type: EntryType; amount: number }[];
}
