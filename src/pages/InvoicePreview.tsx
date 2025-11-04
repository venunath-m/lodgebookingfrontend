import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "../assets/company-logo.png";
import "../components/PrintableInvoice.css";

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
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const data = query.get("data");
  const invoice: Invoice | null = data ? JSON.parse(decodeURIComponent(data)) : null;

  const printRef = useRef<HTMLDivElement>(null);

  // 🧾 Download as PDF
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const element = printRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`Invoice_${invoice?.invoice_id}.pdf`);
  };

  // 🖨️ Print page
  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return <p>Invalid or missing invoice data.</p>;

  return (
    <div className="invoice-preview-container">
      {/* Toolbar */}
      <div className="invoice-toolbar no-print">
        <button onClick={handlePrint}>🖨️ Print</button>
        <button onClick={handleDownloadPDF}>💾 Download PDF</button>
      </div>

      {/* Printable section */}
      <div ref={printRef} className="printable-invoice">
        <div className="invoice-header">
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
          <div className="company-details">
            <h2>My Booking Company Pvt. Ltd.</h2>
            <p>123 Main Street, Kochi, Kerala - 682001</p>
            <p>Email: support@mybooking.com | Phone: +91 99999 99999</p>
          </div>
        </div>

        <hr />

        <div className="invoice-meta">
          <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
          <p><strong>Booking ID:</strong> {invoice.booking_id}</p>
          <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>

        <table className="invoice-items">
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
                <td>₹{item.unitPrice.toFixed(2)}</td>
                <td>₹{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <p><strong>Total:</strong> ₹{invoice.totalAmount.toFixed(2)}</p>
          <p><strong>Tax:</strong> ₹{invoice.tax.toFixed(2)}</p>
          <p><strong>Discount:</strong> ₹{invoice.discount.toFixed(2)}</p>
          <h3><strong>Final Amount:</strong> ₹{invoice.finalAmount.toFixed(2)}</h3>
        </div>

        <div className="invoice-footer">
          <p>Thank you for choosing My Booking Company!</p>
          <p><small>This is a computer-generated invoice.</small></p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
