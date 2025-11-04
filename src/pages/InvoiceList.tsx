"use client";
import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import "./InvoiceList.css";
import Layout from "../components/DashboardLayout";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "../assets/company-logo.png";

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
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    if (!token) return;
    try {
      const res = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  /** 🖨️ Print invoice */
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: selectedInvoice
      ? `Invoice_${selectedInvoice.invoice_id}`
      : "Invoice",
  });

  /** 📄 Download as PDF */
  const handleDownloadPDF = async () => {
    if (!componentRef.current || !selectedInvoice) return;
    const element = componentRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${selectedInvoice.invoice_id}.pdf`);
  };

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
                    <button
                      onClick={() => alert(`Edit invoice ${inv.invoice_id}`)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => alert(`Delete invoice ${inv.invoice_id}`)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setTimeout(() => handlePrint(), 200);
                      }}
                    >
                      Print
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setTimeout(() => handleDownloadPDF(), 200);
                      }}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Printable Area */}
      {selectedInvoice && (
        <div ref={componentRef} className="invoice-print-area">
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
            <p>
              <strong>Invoice ID:</strong> {selectedInvoice.invoice_id}
            </p>
            <p>
              <strong>Booking ID:</strong> {selectedInvoice.booking_id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedInvoice.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>User:</strong> {selectedInvoice.user}
            </p>
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
              {selectedInvoice.items.map((item, idx) => (
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
            <p>
              <strong>Total:</strong> ₹{selectedInvoice.totalAmount}
            </p>
            <p>
              <strong>Tax:</strong> ₹{selectedInvoice.tax}
            </p>
            <p>
              <strong>Discount:</strong> ₹{selectedInvoice.discount}
            </p>
            <h3>
              <strong>Final Amount:</strong> ₹{selectedInvoice.finalAmount}
            </h3>
          </div>

          <div className="invoice-footer">
            <p>Thank you for your business!</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InvoiceList;
