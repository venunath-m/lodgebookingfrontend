"use client"
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import "./InvoiceDetail.css";
import Layout from "../components/DashboardLayout";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface InvoiceDetailType {
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

interface Props {
  invoiceId: number;
}

const InvoiceDetail: React.FC<Props> = ({ invoiceId }) => {
  const { token } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceDetailType | null>(null);

  const fetchInvoice = async () => {
    if (!token) return;
    try {
      const res = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = res.data.find((inv: InvoiceDetailType) => inv.invoice_id === invoiceId);
      setInvoice(found || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId, token]);

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <Layout>
      <div className="invoice-detail-container">
        <h2>Invoice #{invoice.invoice_id}</h2>
        <p>Booking ID: {invoice.booking_id}</p>
        <p>User: {invoice.user}</p>

        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
                <td>{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>Total: {invoice.totalAmount}</p>
        <p>Tax: {invoice.tax}</p>
        <p>Discount: {invoice.discount}</p>
        <h3>Final Amount: {invoice.finalAmount}</h3>
      </div>
    </Layout>
  );
};

export default InvoiceDetail;
