"use client";
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import InvoiceForm from "./InvoiceForm";
import "./InvoiceDashboard.css";
import Layout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Invoice {
  invoice_id: number;
  booking_id: number;
  totalAmount: number;
  tax: number;
  discount: number;
  finalAmount: number;
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  reason?: string;
  items: InvoiceItem[];
}

interface RoomSummary {
  roomName: string;
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  finalAmount: number;
  invoiceCount: number;
}

interface UserSummary {
  userName: string;
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  finalAmount: number;
  invoiceCount: number;
}

interface ServiceSummary {
  serviceName: string;
  quantity: number;
  subtotal: number;
}

const InvoiceDashboard: React.FC = () => {
  const { token } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", userId: "" });

  const [roomSummary, setRoomSummary] = useState<RoomSummary[]>([]);
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummary[]>([]);

  const fetchInvoices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.fromDate) params.from_date = filters.fromDate;
      if (filters.toDate) params.to_date = filters.toDate;
      if (filters.userId) params.user_id = filters.userId;

      const res = await API.get("/reports/invoices", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setInvoices(res.data.invoices);
    } catch (err) {
      console.error(err);
      alert("Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!token) return;

    try {
      const params: Record<string, string> = {};
      if (filters.fromDate) params.from_date = filters.fromDate;
      if (filters.toDate) params.to_date = filters.toDate;

      const res = await API.get("/reports/invoices-summary", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setRoomSummary(res.data.roomTotals);
      setUserSummary(res.data.userTotals);
      setServiceSummary(res.data.serviceTotals);
    } catch (err) {
      console.error(err);
      alert("Error fetching summary");
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchSummary();
  }, [token]);

  const handleEdit = (id: number) => {
    setSelectedInvoiceId(id);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedInvoiceId(null);
    setShowForm(true);
  };

  const handleRefresh = () => {
    fetchInvoices();
    fetchSummary();
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <h1>Invoice Dashboard</h1>

        <div className="summary-panel">
          <div className="summary-section">
            <h3>Room Summary</h3>
            {roomSummary.map((r, idx) => (
              <p key={idx}>
                <strong>{r.roomName}</strong>: {r.invoiceCount} invoices, Final Amount: {r.finalAmount}
              </p>
            ))}
          </div>
          <div className="summary-section">
            <h3>User Summary</h3>
            {userSummary.map((u, idx) => (
              <p key={idx}>
                <strong>{u.userName}</strong>: {u.invoiceCount} invoices, Final Amount: {u.finalAmount}
              </p>
            ))}
          </div>
          <div className="summary-section">
            <h3>Service Summary</h3>
            {serviceSummary.map((s, idx) => (
              <p key={idx}>
                <strong>{s.serviceName}</strong>: {s.quantity} times, Subtotal: {s.subtotal}
              </p>
            ))}
          </div>
        </div>

        <div className="actions">
          <button onClick={handleCreate}>Create Invoice</button>
          <button onClick={handleRefresh}>Refresh</button>
        </div>

        <div className="filters">
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            placeholder="From"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            placeholder="To"
          />
          <input
            type="number"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            placeholder="User ID"
          />
          <button onClick={() => { fetchInvoices(); fetchSummary(); }}>Apply Filters</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking</th>
                <th>Total</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Final</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoice_id} className={inv.isDeleted ? "deleted" : ""}>
                  <td>{inv.invoice_id}</td>
                  <td>{inv.booking_id}</td>
                  <td>{inv.totalAmount}</td>
                  <td>{inv.tax}</td>
                  <td>{inv.discount}</td>
                  <td>{inv.finalAmount}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(inv.invoice_id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              <InvoiceForm invoiceId={selectedInvoiceId || undefined} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDashboard;
