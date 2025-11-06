"use client";
import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "../assets/company-logo.png";
import "./InvoiceList.css";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Invoice {
  invoiceId: number;
  bookingId: number;
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
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const componentRef = useRef<HTMLDivElement>(null);

  /** Fetch invoices */
  const fetchInvoices = async () => {
    if (!token) return;
    try {
      const res = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  /** Print setup */
const handlePrint = useReactToPrint({
  // @ts-ignore
  content: () => componentRef.current,
  documentTitle: selectedInvoice
    ? `Invoice_${selectedInvoice.invoiceId}`
    : "Invoice",
  pageStyle: `
    @page { size: ${orientation}; margin: 15mm; }
    body { font-family: Arial, sans-serif; }
  `,
});


  /** Open print modal */
  const openPrintModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintModal(true);
  };

  /** Confirm print */
  const confirmPrint = () => {
    setShowPrintModal(false);
    setTimeout(() => handlePrint && handlePrint(), 300);
  };

  /** Download PDF */
  const handleDownloadPDF = async () => {
    if (!componentRef.current || !selectedInvoice) return;
    const element = componentRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF(orientation === "portrait" ? "p" : "l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${selectedInvoice.invoiceId}.pdf`);
  };

  return (
    <Layout>
      <div className="invoice-list-container">
        <h2>🧾 Invoice List</h2>

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
                <tr key={inv.invoiceId}>
                  <td>{inv.invoiceId}</td>
                  <td>{inv.bookingId}</td>
                  <td>{inv.user}</td>
                  <td>₹{inv.totalAmount}</td>
                  <td>{inv.tax}%</td>
                  <td>₹{inv.discount}</td>
                  <td><strong>₹{inv.finalAmount}</strong></td>
                  <td>{new Date(inv.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => openPrintModal(inv)}>Print</button>
                    <button onClick={() => {
                      const invoiceData = encodeURIComponent(JSON.stringify(inv));
                      window.open(`/invoice/preview/${inv.invoiceId}?data=${invoiceData}`, "_blank");
                    }}>PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Print Preview Modal */}
      {showPrintModal && selectedInvoice && (
        <div className="print-modal-overlay" >
          <div className="print-modal"style={{background:"#30495aff",}}>
            <h3>🖨️ Print Preview Settings</h3>

            <label style={{ color:"#fff" }}>
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
              />
              Include Company Logo
            </label>

            <label style={{ marginTop: "10px",color:"#fff" }}>
              Page Orientation:
              <select
                value={orientation}
                onChange={(e) =>
                  setOrientation(e.target.value as "portrait" | "landscape")
                }
                style={{ marginLeft: "10px" }}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>

            <div className="modal-actions">
              <button onClick={confirmPrint}>Print Now</button>
              <button onClick={() => setShowPrintModal(false)}>Cancel</button>
              <button onClick={handleDownloadPDF}>Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Invoice */}
      {selectedInvoice && (
        <div
          ref={componentRef}
          className="invoice-print-area"
          style={{
            display: showPrintModal ? "none" : "block",
            background: "#000",
            padding: "30px",
          }}
        >
          
        <div style={{ margin: "0 60px" }}>
          <div className="invoice-header">
            {includeLogo && (
              <img src={companyLogo} alt="Company Logo" className="invoice-logo" />
            )}
            <div className="company-details">
              <h2>Nova Residency</h2>
              <p>123 Business Street, City, State</p>
              <p>Email: info@company.com | Phone: +91 98765 43210</p>
            </div>
          </div>

          <hr />

          <div className="invoice-meta">
            <p><strong>Invoice ID:</strong> {selectedInvoice.invoiceId}</p>
            <p><strong>Booking ID:</strong> {selectedInvoice.bookingId}</p>
            <p><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}</p>
            <p><strong>User:</strong> {selectedInvoice.user}</p>
          </div>

          <table className="invoice-items-table">
            <thead>
              <tr >
                <th style={{backgroundColor:"#667eea"}}>Description</th>
                <th style={{backgroundColor:"#667eea"}}>Qty</th>
                <th style={{backgroundColor:"#667eea"}}>Unit Price</th>
                <th style={{backgroundColor:"#667eea"}}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice}</td>
                  <td>₹{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-summary">
            <p><strong>Total:</strong> ₹{selectedInvoice.totalAmount}</p>
            <p><strong>Tax:</strong> ₹{selectedInvoice.tax}</p>
            <p><strong>Discount:</strong> ₹{selectedInvoice.discount}</p>
            <h3><strong>Final Amount:</strong> ₹{selectedInvoice.finalAmount}</h3>
          </div>

              <div className="invoice-terms" style={{ marginTop: "20px", textAlign: "left" }}>
              <h4>Terms & Conditions</h4>
              <p>• Full payment confirms booking.</p>
              <p>• Check-in: 2:00 PM | Check-out: 11:00 AM.</p>
              <p>• No cancellation or refund once booked.</p>
              <p>• No smoking or alcohol allowed on the property.</p>
              <p>• Damage to property will be charged to the guest.</p>
              <p>• Extra guests not allowed beyond room capacity.</p>
              <p>• Management not liable for loss of valuables.</p>
            </div>


          <div className="invoice-footer">
            <p>Thank you for your business!</p>
          </div>
          
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InvoiceList;
