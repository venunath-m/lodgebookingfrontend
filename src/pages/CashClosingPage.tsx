import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import CashClosingDialog from "../components/CashClosingDialog";
import "./CashClosingPage.css";

export default function CashClosingPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await API.get("/cashclosing/daily-report", {
        params: { dateFilter },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await API.get("/cashclosing", {
        params: { dateFilter, page },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.items || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
      fetchRecords();
    }
  }, [token, dateFilter, page]);

  return (
    <div className="cash-closing-container">

      <div className="cash-closing-header">
        <h1>Daily Cash Closing</h1>

        <div className="cash-closing-actions">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="cash-closing-date"
          />

          <button className="cash-closing-button" onClick={() => setIsDialogOpen(true)}>
            New Closing
          </button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <table className="cash-closing-table">
          <thead>
            <tr>
              <th>Cash</th>
              <th>UPI</th>
              <th>Card</th>
              <th>Online</th>
              <th><b>System Total</b></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>₹ {summary.cashTotal}</td>
              <td>₹ {summary.upiTotal}</td>
              <td>₹ {summary.cardTotal}</td>
              <td>₹ {summary.onlineTotal}</td>
              <td><b>₹ {summary.systemTotal}</b></td>
            </tr>
          </tbody>
        </table>
      )}

      {/* History Table */}
      <table className="cash-closing-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Cash</th>
            <th>Online</th>
            <th>UPI</th>
            <th>Card</th>
            <th>System</th>
            <th>Difference</th>
            <th>Entered By</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={8} className="no-data">No records found</td>
            </tr>
          )}

          {records.map((r, idx) => (
            <tr key={idx}>
              <td>{r.closingDate}</td>
              <td>₹ {r.cashAmount}</td>
              <td>₹ {r.onlineAmount}</td>
              <td>₹ {r.upiAmount}</td>
              <td>₹ {r.cardAmount}</td>
              <td>₹ {r.systemAmount}</td>
              <td className={r.difference !== 0 ? "diff-bad" : "diff-good"}>₹ {r.difference}</td>
              <td>{r.user?.name || "User #" + r.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="cash-closing-pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {/* Popup */}
      <CashClosingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => { fetchSummary(); fetchRecords(); }}
      />

    </div>
  );
}
