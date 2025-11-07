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
  const { token, user } = useAuth();

  // Payment totals
  const [cash, setCash] = useState(0);
  const [upi, setUpi] = useState(0);
  const [card, setCard] = useState(0);
  const [online, setOnline] = useState(0);

  const [notes, setNotes] = useState<DenominationMap>({
    "500": 0, "200": 0, "100": 0, "50": 0, "20": 0, "10": 0, "5": 0, "2": 0, "1": 0
  });

  const [systemAmount, setSystemAmount] = useState(0);
  const [difference, setDifference] = useState(0);
  const [loading, setLoading] = useState(false);

  // Closing date picker
  const [closingDate, setClosingDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Calculate counted cash from denominations
  const countedCash = Object.entries(notes).reduce(
    (sum, [note, cnt]) => sum + Number(note) * Number(cnt),
    0
  );

  // Fetch invoices and calculate totals by date
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await API.get("/invoices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;

        const invoices: any[] = res.data || [];

        // Filter invoices by selected date (local date)
        const filtered = invoices.filter(inv => {
          const invDate = new Date(inv.createdAt);
          const invLocalDate = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2,'0')}-${String(invDate.getDate()).padStart(2,'0')}`;
          return invLocalDate === closingDate;
        });

        // Compute totals by payment method
        let cashTotal = 0, upiTotal = 0, cardTotal = 0, onlineTotal = 0;

        filtered.forEach(inv => {
          switch (inv.paymentMethod?.toUpperCase()) {
            case "CASH": cashTotal += inv.finalAmount; break;
            case "UPI": upiTotal += inv.finalAmount; break;
            case "CARD": cardTotal += inv.finalAmount; break;
            case "ONLINE": onlineTotal += inv.finalAmount; break;
            default: cashTotal += inv.finalAmount; // assume cash if null
          }
        });

        setCash(cashTotal);
        setUpi(upiTotal);
        setCard(cardTotal);
        setOnline(onlineTotal);
      } catch (err) {
        console.error(err);
        alert("Error fetching invoices");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInvoices();
    return () => { cancelled = true; };
  }, [token, closingDate]);

  // Update systemAmount and difference
  useEffect(() => {
    const totalSys = cash + upi + card + online;
    setSystemAmount(totalSys);
    setDifference(countedCash - totalSys);
  }, [cash, upi, card, online, countedCash]);

  const updateNote = (key: keyof DenominationMap, value: number) => {
    setNotes(prev => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const handleSubmit = async () => {
    if (!user || !token) {
      alert("Not authenticated. Please login and try again.");
      return;
    }

    try {
      await API.post("/cashclosing", {
        userId: user.id,
        denominations: notes,
        cashAmount: cash,
        upiAmount: upi,
        cardAmount: card,
        onlineAmount: online,
        systemAmount,
        difference,
        cashCounted: countedCash,
        closingDate
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("Cash Closing Saved ✅");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.detail ?? "Error saving cash closing");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" role="dialog" aria-modal>
      <div className="dialog-box">
        <h2 className="dialog-title" style={{ color: "#667eea" }}>Cash Closing</h2>

        <div className="dialog-content">
          {loading && <div style={{ marginBottom: 12 }}>Loading system totals...</div>}

          <div className="summary-row">
            <div>User: <strong>{user?.name ?? "Unknown"}</strong></div>
            <div>
              Closing Date:{" "}
              <input
                type="date"
                value={closingDate}
                onChange={e => setClosingDate(e.target.value)}
              />
            </div>
          </div>

          <div className="summary-row">
            <div>Cash: <strong>₹ {cash.toFixed(2)}</strong></div>
            <div>UPI: <strong>₹ {upi.toFixed(2)}</strong></div>
            <div>Card: <strong>₹ {card.toFixed(2)}</strong></div>
            <div>Online: <strong>₹ {online.toFixed(2)}</strong></div>
          </div>

          <hr />

          <h3 className="report-title">Denomination Count</h3>
          <div className="denomination-table">
            <table>
              <thead>
                <tr><th>Note</th><th>Count</th><th>Total</th></tr>
              </thead>
              <tbody>
                {(Object.keys(notes) as Array<keyof DenominationMap>).map(note => (
                  <tr key={note}>
                    <td>₹ {note}</td>
                    <td>
                      <input
                        className="den-input"
                        type="number"
                        min={0}
                        value={notes[note]}
                        onChange={e => updateNote(note, Number(e.target.value))}
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

          <div style={{ marginTop: 8 }}>
            <div>System Amount: <strong>₹ {systemAmount.toFixed(2)}</strong></div>
            <div className={`difference ${difference !== 0 ? "bad" : "good"}`}>
              Difference: <strong>₹ {difference.toFixed(2)}</strong>
            </div>
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
