"use client";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useInvoice } from "./InvoiceContext";
import companyLogo from "../assets/company-logo.png";
import "./BookingInvoicePreview.css";

const BookingInvoicePreview: React.FC = () => {
  const { invoice } = useInvoice();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) {
    return (
      <div className="p-8">
        <p>No invoice data found.</p>
        <button onClick={() => navigate(-1)} className="btn mt-4">
          Go Back
        </button>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;
    const marginX = (pageWidth - imgWidth) / 2;

    pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position;

    while (heightLeft > 0) {
      pdf.addPage();
      position = -(imgHeight - heightLeft);
      pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Invoice_${invoice.invoice_id}.pdf`);
  };

  // Normalize room data
  const room =
    typeof invoice.room === "object" && invoice.room !== null
      ? invoice.room
      : { name: invoice.room, price: invoice.totalAmount || 0, type: "-" };

  const unitPrice = room.price || invoice.totalAmount || 0;
  const nights = invoice.numberOfDates || 1;
  const subtotal = unitPrice * nights;
  const tax = invoice.tax || 0;
  const discount = invoice.discount || 0;
  const finalAmount =
    invoice.finalAmount !== undefined
      ? invoice.finalAmount
      : subtotal + tax - discount;

  return (
    <div className="modal-overlay show">
      <div
        className="modal-card show max-w-4xl"
        style={{ minWidth: "900px", background: "#fff", position: "relative" }}
      >
        {/* Toolbar */}
        <div className="toolbar">
          <h2>Invoice Preview</h2>
          <div className="toolbar-buttons">
            <button onClick={() => window.print()} className="btn print-btn">
              🖨️ Print
            </button>
            <button onClick={handleDownloadPDF} className="btn pdf-btn">
              💾 PDF
            </button>
            <button onClick={() => navigate(-1)} className="btn close-btn">
              ✖ Close
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div
  ref={printRef}
  className="printable-invoice"
  style={{
    width: "794px",               // A4 width
    minHeight: "1123px",          // A4 height at 96 DPI
    margin: "0 auto",
    background: "#fff",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    padding: "140px 40px 40px 40px", // leave top space for header
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // pushes footer to bottom
    position: "relative",
  }}
>
  {/* ---------- Fixed Header ---------- */}
  <div
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      padding: "20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #ddd",
      background: "#fff",
    }}
  >
    <img
      src={companyLogo}
      alt="Company Logo"
      style={{ width: "80px", height: "auto" }}
    />
    <div style={{ textAlign: "right" }}>
      <h2 style={{ margin: 0 }}>Novo Residency</h2>
      <p style={{ margin: 0, fontSize: "12px" }}>
        123 Main Street, Kochi, Kerala - 682001
      </p>
      <p style={{ margin: 0, fontSize: "12px" }}>
        Email: support@mybooking.com | Phone: +91 99999 99999
      </p>
    </div>
  </div>

  {/* ---------- Invoice Body ---------- */}
  <div style={{ flex: "1", marginTop: "20px" }}>
    <h3
      style={{
        textAlign: "center",
        textTransform: "uppercase",
        marginBottom: "20px",
        marginTop: "0",
      }}
    >
      <strong>INVOICE</strong>
    </h3>

    {/* Customer Info */}
    <div style={{ marginBottom: "15px", textAlign: "left" }}>
      <h4 style={{
        fontSize:"16px"}}><u>Invoice ID: {invoice.invoice_id || invoice.id}</u></h4>
      <p>
        <strong>Customer Name:</strong>{" "}
        {invoice.customerName || invoice.name || "N/A"}
      </p>
      <p>
        <strong>Mobile:</strong> {invoice.mobile || "N/A"}
      </p>
      <p>
        <strong>Address:</strong> {invoice.address || "N/A"}
      </p>
      {invoice.customerGstNo && (
        <p>
          <strong>GST No:</strong> {invoice.customerGstNo}
        </p>
      )}
    </div>

    <hr />

    {/* Room & Booking Details */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          flex: 1,
          borderRight: "1px solid #ddd",
          paddingRight: "20px",
        }}
      >
        <h4>Room Details</h4>
        <p>
          <strong>Room:</strong> {room.name || "N/A"}
        </p>
        <p>
          <strong>Safe Locker Used:</strong> {invoice.safe ? "Yes" : "No"}
        </p>
        <p>
          <strong>Rate:</strong> ₹{unitPrice.toFixed(2)} / night
        </p>
      </div>

      <div style={{ flex: 1, paddingLeft: "20px" }}>
        <h4>Booking Details</h4>
        <p>
          <strong>Check-In:</strong>{" "}
          {invoice.checkInDate || invoice.startDate}{" "}
          {invoice.checkInTime && `(${invoice.checkInTime})`}
        </p>
        <p>
          <strong>Check-Out:</strong>{" "}
          {invoice.checkOutDate || invoice.endDate}{" "}
          {invoice.checkOutTime && `(${invoice.checkOutTime})`}
        </p>
        <p>
          <strong>Total Nights:</strong> {nights}
        </p>
        <p>
          <strong>Total People:</strong> {invoice.totalNoPeople || 0}
        </p>
      </div>
    </div>

    <hr />

    {/* Price Summary */}
    <h4>Price Summary</h4>
    <table
      className="invoice-table"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "15px",
      }}
    >
      <thead>
        <tr style={{ background: "#f2f2f2" }}>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Description
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
            }}
          >
            Qty (Nights)
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "right",
            }}
          >
            Unit Price
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "right",
            }}
          >
            Subtotal
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            {room.name || "Room Booking"}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {nights}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "right",
            }}
          >
            ₹{unitPrice.toFixed(2)}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "right",
            }}
          >
            ₹{subtotal.toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>

    {/* Totals */}
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "10px",
      }}
    >
      <div style={{ textAlign: "right", minWidth: "250px" }}>
        <p>
          <strong>Tax:</strong> ₹{tax.toFixed(2)}
        </p>
        <p>
          <strong>Discount:</strong> ₹{discount.toFixed(2)}
        </p>
        <hr />
        <h3>
          <strong>Final Amount:</strong> ₹{finalAmount.toFixed(2)}
        </h3>
      </div>
    </div>
  </div>

  {/* ---------- Fixed Footer ---------- */}
  <footer
    style={{
      borderTop: "1px solid #ddd",
      paddingTop: "10px",
      textAlign: "center",
      fontSize: "12px",
      background: "#fff",
    }}
  >
    <p style={{ margin: "4px 0" }}>Thank you for choosing Novo Residency!</p>
    <p style={{ margin: 0 }}>
      <small>This is a computer-generated invoice.</small>
    </p>
  </footer>
</div>

      </div>
    </div>
  );
};

export default BookingInvoicePreview;
