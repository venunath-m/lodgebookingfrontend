import axios from "axios";
import {
  Account,
  AccountCreate,
  JournalEntry,
  JournalEntryCreate,
  TrialBalanceResponse,
  ProfitLossResponse,
  BalanceSheetResponse
} from "../types/accounting";

const API_URL = "https://lodgebookingbackend.onrender.com/accounting";

export const getAccounts = async (): Promise<Account[]> => {
  const res = await axios.get(`${API_URL}/accounts`);
  return res.data;
};

export const createAccount = async (data: AccountCreate): Promise<Account> => {
  const res = await axios.post(`${API_URL}/accounts`, data);
  return res.data;
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  const res = await axios.get(`${API_URL}/journal_entries`);
  return res.data;
};

export const createJournalEntry = async (data: JournalEntryCreate): Promise<JournalEntry> => {
  const res = await axios.post(`${API_URL}/journal_entries`, data);
  return res.data;
};

export const getTrialBalance = async (): Promise<TrialBalanceResponse> => {
  const res = await axios.get(`${API_URL}/trial_balance`);
  return res.data;
};

export const getProfitLoss = async (): Promise<ProfitLossResponse> => {
  const res = await axios.get(`${API_URL}/profit_loss`);
  return res.data;
};

export const getBalanceSheet = async (): Promise<BalanceSheetResponse> => {
  const res = await axios.get(`${API_URL}/balance_sheet`);
  return res.data;
};

export const getYearEndSummary = async () => {
  const response = await axios.get(`${API_URL}/accounting/yearend/summary`);
  return response.data;
};

export const closeYearEnd = async () => {
  const response = await axios.post(`${API_URL}/accounting/yearend/close`);
  return response.data;
};