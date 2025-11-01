import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { getYearEndSummary, closeYearEnd } from "../../services/accountingService";

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  year: string;
  isClosed?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const YearEndProcess: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch summary data
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await getYearEndSummary();
      setSummary(data);
    } catch {
      setMessage("Error fetching summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Handle close year
  const handleCloseYear = async () => {
    setProcessing(true);
    try {
      const res = await closeYearEnd();
      setMessage(res.message);
      await fetchSummary();
    } catch {
      setMessage("Error closing year");
    } finally {
      setProcessing(false);
    }
  };

  // Handle reopen year
  const handleReopenYear = async () => {
    setProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/accounting/yearend/reopen`);
      setMessage(res.data.message);
      await fetchSummary();
    } catch {
      setMessage("Error reopening year");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Year-End Accounting Process</h1>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : (
        summary && (
          <Card className="p-6 shadow-lg rounded-2xl bg-white">
            <h2 className="text-xl font-semibold mb-3">
              Summary for {summary.year}
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Total Income:</strong> ₹{summary.totalIncome.toFixed(2)}
              </p>
              <p>
                <strong>Total Expense:</strong> ₹{summary.totalExpense.toFixed(2)}
              </p>
              <p>
                <strong>Net Profit:</strong> ₹{summary.netProfit.toFixed(2)}
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              {summary.isClosed ? (
                <Button
                  onClick={handleReopenYear}
                  disabled={processing || loading}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  {processing ? "Processing..." : "Reopen Year"}
                </Button>
              ) : (
                <Button
                  onClick={handleCloseYear}
                  disabled={processing || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
                >
                  {processing ? "Processing..." : "Close Year"}
                </Button>
              )}
            </div>
          </Card>
        )
      )}

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default YearEndProcess;
