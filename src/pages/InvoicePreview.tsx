"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import companyLogo from "../assets/company-logo.png";
import "./InvoiceList.css";

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
  items: InvoiceItem[];
}

const InvoicePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await API.get(`/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoice(res.data);
      } catch (err) {
        console.error("Error loading invoice:", err);
      }
    };
    fetchInvoice();
  }, [id, token]);

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;
    const element = componentRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${invoice?.invoice_id}.pdf`);
  };

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <div
      ref={componentRef}
      className="invoice-print-area"
      style={{ background: "white", padding: "40px" }}
    >
      <div className="invoice-header">
        <img src={companyLogo} alt="Company Logo" className="invoice-logo" />
        <div className="company-details">
          <h2>Your Company Name</h2>
          <p>123 Business Street, City, State</p>
          <p>Email: info@company.com | Phone: +91 98765 43210</p>
        </div>
      </div>

      <hr />

      <div className="invoice-meta">
        <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
        <p><strong>Booking ID:</strong> {invoice.booking_id}</p>
        <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
        <p><strong>User:</strong> {invoice.user}</p>
      </div>

      <table className="invoice-items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
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

      <div className="invoice-summary">
        <p><strong>Total:</strong> ₹{invoice.totalAmount}</p>
        <p><strong>Tax:</strong> ₹{invoice.tax}</p>
        <p><strong>Discount:</strong> ₹{invoice.discount}</p>
        <h3><strong>Final Amount:</strong> ₹{invoice.finalAmount}</h3>
      </div>

      <div className="invoice-footer">
        <p>Thank you for your business!</p>
        <button onClick={handleDownloadPDF} style={{ marginTop: "20px" }}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;
