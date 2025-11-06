import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import "./CashClosingDialog.css";

type DenominationMap = {  
  "500": number;
  "200": number;
  "100": number;
  "50": number;
  "20": number;
  "10": number;
  "5": number;
  "2": number;
  "1": number;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CashClosingDialog({ isOpen, onClose, onSuccess }: Props) {
  const { token } = useAuth();

  // System totals (from invoices)
  const [cash, setCash] = useState<number>(0);
  const [online, setOnline] = useState<number>(0);
  const [upi, setUpi] = useState<number>(0);
  const [card, setCard] = useState<number>(0);

  // Denominations (structured)
  const [notes, setNotes] = useState<DenominationMap>({    
    "500": 0,
    "200": 0,
    "100": 0,
    "50": 0,
    "20": 0,
    "10": 0,
    "5": 0,
    "2": 0,
    "1": 0,
  });

  const [systemAmount, setSystemAmount] = useState<number>(0);
  const [difference, setDifference] = useState<number>(0);
  const [invoices, setInvoices] = useState<any[]>([]); // day's invoice list (for report summary)
  const [loading, setLoading] = useState(false);

  // fetch invoices to compute system totals and show report table
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await API.get("/invoices", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const items = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        if (cancelled) return;

        setInvoices(items);

        const getSum = (method: string) =>
          items
            .filter((inv: any) => (inv.paymentMethod ?? "").toLowerCase() === method)
            .reduce((sum: number, inv: any) => sum + (Number(inv.finalAmount) || 0), 0);

        setCash(getSum("cash"));
        setOnline(getSum("online"));
        setUpi(getSum("upi"));
        setCard(getSum("card"));
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // compute countedCash (from denominations), systemAmount and difference
  const countedCash = Object.entries(notes).reduce(
    (sum, [note, cnt]) => sum + Number(note) * Number(cnt),
    0
  );

  useEffect(() => {
    const totalSys = cash + online + upi + card;
    setSystemAmount(totalSys);
    setDifference(countedCash - totalSys);
  }, [cash, online, upi, card, countedCash]);

  // safe update for denominations: key typed as keyof DenominationMap
  const updateNote = (key: keyof DenominationMap, value: number) => {
    setNotes((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const handleSubmit = async () => {
    try {
      await API.post(
        "/cashclosing",
        {
          denominations: notes, // breakdown
          cashAmount: cash,
          onlineAmount: online,
          upiAmount: upi,
          cardAmount: card,
          systemAmount,
          difference,
          cashCounted: countedCash,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      alert("Cash Closing Saved ✅");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving cash closing:", err);
      alert(err?.response?.data?.detail ?? "Error saving cash closing");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" role="dialog" aria-modal>
      <div className="dialog-box">
        <h2 className="dialog-title" style={{color:"#667eea"}}>Cash Closing</h2>

        <div className="dialog-content">
          {loading ? (
            <div style={{ marginBottom: 12 }}>Loading transactions...</div>
          ) : null}

          <div className="summary-row">
            <div>Cash Payments: <strong>₹ {cash.toFixed(2)}</strong></div>
            <div>Online Payments: <strong>₹ {online.toFixed(2)}</strong></div>
            <div>UPI Payments: <strong>₹ {upi.toFixed(2)}</strong></div>
            <div>Card Payments: <strong>₹ {card.toFixed(2)}</strong></div>
          </div>

          <hr />

          {/* Denomination breakdown */}
          <h3 className="report-title">Denomination Count</h3>
          <div className="denomination-table">
            <table>
              <thead>
                <tr>
                  <th>Note</th>
                  <th>Count</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(notes) as Array<keyof DenominationMap>).map((note) => (
                  <tr key={note}>
                    <td>₹ {note}</td>
                    <td>
                      <input
                        className="den-input"
                        type="number"
                        min={0}
                        value={notes[note]}
                        onChange={(e) => updateNote(note, Number(e.target.value))}
                      />
                    </td>
                    <td>₹ {(Number(note) * notes[note]).toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Total Cash Counted</strong></td>
                  <td></td>
                  <td><strong>₹ {countedCash.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* System & Difference */}
          <div style={{ marginTop: 8 }}>
            <div>System Amount: <strong>₹ {systemAmount.toFixed(2)}</strong></div>
            <div className={`difference ${difference !== 0 ? "bad" : "good"}`}>
              Difference: <strong>₹ {difference.toFixed(2)}</strong>
            </div>
          </div>

          <h3 className="report-title" style={{ marginTop: 12 }}>Report Summary (Today)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Payment</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 10 }}>
                      No transactions found
                    </td>
                  </tr>
                )}
                {invoices.map((inv, i) => (
                  <tr key={i}>
                    <td>{inv.customerName ?? "-"}</td>
                    <td>{inv.room ?? "-"}</td>
                    <td>{(inv.paymentMethod ?? "").toString()}</td>
                    <td className="right">₹ {(Number(inv.finalAmount) || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="btn-row">
            <button className="btn cancel" onClick={onClose}>Cancel</button>
            <button className="btn save" onClick={handleSubmit}>Save Closing</button>
          </div>
        </div>
      </div>
    </div>
  );
}