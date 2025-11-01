"use client"
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import "./InvoiceList.css";
import Layout from "../components/DashboardLayout";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Invoice {
  invoice_id: number;
  booking_id: number;
  user: string | number;
  totalAmount: number;
  tax: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt?: string;
  reason?: string;
  isDeleted: boolean;
  items: InvoiceItem[];
}

const InvoiceList: React.FC = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInvoices = async () => {
    if (!token) return;
    try {
      const res = await API.get("/invoices", { headers: { Authorization: `Bearer ${token}` } });
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  return (
    <Layout>
      <div className="invoice-list-container">
        <h2>Invoices</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoice_id}>
                  <td>{inv.invoice_id}</td>
                  <td>{inv.booking_id}</td>
                  <td>{inv.user}</td>
                  <td>{inv.totalAmount}</td>
                  <td>{inv.tax}</td>
                  <td>{inv.discount}</td>
                  <td>{inv.finalAmount}</td>
                  <td>{new Date(inv.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => alert(`Edit invoice ${inv.invoice_id}`)}>Edit</button>
                    <button onClick={() => alert(`Delete invoice ${inv.invoice_id}`)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceList;
