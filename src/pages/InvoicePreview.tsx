// import React, { useRef, useEffect, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import companyLogo from "../assets/company-logo.png";
// import "../components/PrintableInvoice.css";

// interface InvoiceItem {
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
// }

// interface InvoiceResponse {
//   invoice_id: number;
//   booking_id: number;
//   totalAmount: number;
//   tax: number;
//   discount: number;
//   finalAmount: number;
//   createdAt: string;
//   updatedAt?: string;
//   reason?: string;
//   isDeleted?: boolean;
//   customerName?: string;
//   mobile?: string;
//   roomNo?: string;
//   room?: string;
//   checkInDate?: string;
//   checkOutDate?: string;
//   checkInTime?: string;
//   checkOutTime?: string;
//   bookingSource?: string;
//   safe?: boolean;
//   gstNo?: string;
//   numberOfDates?: number;
//   totalNoPeople?: number;
//   items: InvoiceItem[];
// }

// const InvoicePreview: React.FC = () => {
//   const printRef = useRef<HTMLDivElement>(null);
//   const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);

//   // ✅ Read invoice data from query param
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const encodedData = params.get("data");
//     if (encodedData) {
//       try {
//         const parsed = JSON.parse(decodeURIComponent(encodedData));
//         setInvoice(parsed);
//       } catch (err) {
//         console.error("Invalid invoice data:", err);
//       }
//     }
//   }, []);

//   // ✅ Download as PDF
//   const handleDownloadPDF = async () => {
//     if (!printRef.current) return;
//     const canvas = await html2canvas(printRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`Invoice_${invoice?.invoice_id}.pdf`);
//   };

//   // ✅ Print directly
//   const handlePrint = () => window.print();

//   if (!invoice) return <p>Loading invoice details...</p>;

//   return (
//     <div className="invoice-preview-container">
//       {/* Toolbar */}
//       <div className="invoice-toolbar no-print">
//         <button onClick={handlePrint}>🖨️ Print</button>
//         <button onClick={handleDownloadPDF}>💾 Download PDF</button>
//       </div>

//       {/* Printable area */}
//       <div ref={printRef} className="printable-invoice">
//         {/* Header */}
//         <div className="invoice-header">
//           <img src={companyLogo} alt="Company Logo" className="company-logo" />
//           <div className="company-details">
//             <h2>Nova Residency</h2>
//             <p>123 Main Street, Kochi, Kerala - 682001</p>
//             <p>Email: support@mybooking.com | Phone: +91 99999 99999</p>
//           </div>
//         </div>

//         <hr />

//     <div style={{margin:"0 60px"}}>
//         {/* Invoice Meta */}
//         <div className="invoice-meta" >
//           <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
//           <p><strong>Booking ID:</strong> {invoice.booking_id}</p>
//           <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
//           {invoice.reason && <p><strong>Edit Reason:</strong> {invoice.reason}</p>}
//         </div>

//         {/* Customer Details */}
//         <div className="customer-details">
//           <h3>Customer Details</h3>
//           <p><strong>Name:</strong> {invoice.customerName || "N/A"}</p>
//           <p><strong>Mobile:</strong> {invoice.mobile || "N/A"}</p>
//           <p><strong>GST No:</strong> {invoice.gstNo || "N/A"}</p>
//           <p><strong>Booking Source:</strong> {invoice.bookingSource || "N/A"}</p>
//           <p><strong>Safe Required:</strong> {invoice.safe ? "Yes" : "No"}</p>
//           <p><strong>Total People:</strong> {invoice.totalNoPeople || 0}</p>
//           <p><strong>No. of Days:</strong> {invoice.numberOfDates || 0}</p>
//         </div>

//         {/* Room Details */}
//         <div className="room-details" >
//           <h3>Room Details</h3>
//           <p><strong>Room:</strong> {invoice.room} ({invoice.roomNo})</p>
//           <p><strong>Check-in:</strong> {invoice.checkInDate} {invoice.checkInTime}</p>
//           <p><strong>Check-out:</strong> {invoice.checkOutDate} {invoice.checkOutTime}</p>
//         </div>

//         {/* Items Table */}
//         <table className="invoice-items" >
//           <thead>
//             <tr>
//               <th>Description</th>
//               <th>Qty</th>
//               <th>Unit Price</th>
//               <th>Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.items.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{item.description}</td>
//                 <td>{item.quantity}</td>
//                 <td>₹{item.unitPrice.toFixed(2)}</td>
//                 <td>₹{item.subtotal.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Summary */}
//         <div className="invoice-summary">
//           <p><strong>Total:</strong> ₹{invoice.totalAmount.toFixed(2)}</p>
//           <p><strong>Tax:</strong> ₹{invoice.tax.toFixed(2)}</p>
//           <p><strong>Discount:</strong> ₹{invoice.discount.toFixed(2)}</p>
//           <h3><strong>Final Amount:</strong> ₹{invoice.finalAmount.toFixed(2)}</h3>
//         </div>

//         </div>

//         {/* Footer */}
//         <div className="invoice-footer">
//           <p>Thank you for choosing Nova Residency!</p>
//           <p><small>This is a computer-generated invoice.</small></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoicePreview;


import React, { useRef, useEffect, useState } from "react";
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

interface InvoiceResponse {
  invoice_id: number;
  booking_id: number;
  totalAmount: number;
  tax: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt?: string;
  reason?: string;
  isDeleted?: boolean;
  customerName?: string;
  mobile?: string;
  roomNo?: string;
  room?: string;
  checkInDate?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  bookingSource?: string;
  safe?: boolean;
  gstNo?: string;
  numberOfDates?: number;
  totalNoPeople?: number;
  items: InvoiceItem[];
}

const InvoicePreview: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);

  // ✅ Read invoice data from query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("data");
    if (encodedData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(encodedData));
        setInvoice(parsed);
      } catch (err) {
        console.error("Invalid invoice data:", err);
      }
    }
  }, []);

  // ✅ Download as PDF
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${invoice?.invoice_id}.pdf`);
  };

  // ✅ Print directly
  const handlePrint = () => window.print();

  if (!invoice) return <p>Loading invoice details...</p>;

  return (
    <div className="invoice-preview-container">
      {/* Toolbar */}
      <div className="invoice-toolbar no-print">
        <button onClick={handlePrint}>🖨️ Print</button>
        <button onClick={handleDownloadPDF}>💾 Download PDF</button>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="printable-invoice">
        {/* Header */}
        <div className="invoice-header">
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
          <div className="company-details">
            <h2>Nova Residency</h2>
            <p>123 Main Street, Kochi, Kerala - 682001</p>
            <p>Email: support@mybooking.com | Phone: +91 99999 99999</p>
          </div>
        </div>

        <hr />

        <div style={{ margin: "0 60px" }}>
          {/* Invoice Meta */}
          <div className="invoice-meta">
            <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
            <p><strong>Booking ID:</strong> {invoice.booking_id}</p>
            <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
            {invoice.reason && <p><strong>Edit Reason:</strong> {invoice.reason}</p>}
          </div>

          {/* Customer Details */}
          <div className="customer-details">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {invoice.customerName || "N/A"}</p>
            <p><strong>Mobile:</strong> {invoice.mobile || "N/A"}</p>
            <p><strong>GST No:</strong> {invoice.gstNo || "N/A"}</p>
            <p><strong>Booking Source:</strong> {invoice.bookingSource || "N/A"}</p>
            <p><strong>Safe Required:</strong> {invoice.safe ? "Yes" : "No"}</p>
            <p><strong>Total People:</strong> {invoice.totalNoPeople || 0}</p>
            <p><strong>No. of Days:</strong> {invoice.numberOfDates || 0}</p>
          </div>

          {/* Room Details */}
          <div className="room-details">
            <h3>Room Details</h3>
            <p><strong>Room:</strong> {invoice.room} ({invoice.roomNo})</p>
            <p><strong>Check-in:</strong> {invoice.checkInDate} {invoice.checkInTime}</p>
            <p><strong>Check-out:</strong> {invoice.checkOutDate} {invoice.checkOutTime}</p>
          </div>

          {/* Items Table */}
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

          {/* Summary */}
          <div className="invoice-summary">
            <p><strong>Total:</strong> ₹{invoice.totalAmount.toFixed(2)}</p>
            <p><strong>Tax:</strong> ₹{invoice.tax.toFixed(2)}</p>
            <p><strong>Discount:</strong> ₹{invoice.discount.toFixed(2)}</p>
            <h3><strong>Final Amount:</strong> ₹{invoice.finalAmount.toFixed(2)}</h3>
          </div>

          {/* ✅ Terms & Conditions */}
          <div className="invoice-terms" style={{ marginTop: "20px" }}>
            <h4>Terms & Conditions</h4>
            <p>• Full payment confirms booking.</p>
            <p>• Check-in: 2:00 PM | Check-out: 11:00 AM.</p>
            <p>• No cancellation or refund once booked.</p>
            <p>• No smoking or alcohol allowed on the property.</p>
            <p>• Damage to property will be charged to the guest.</p>
            <p>• Extra guests not allowed beyond room capacity.</p>
            <p>• Management not liable for loss of valuables.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <p>Thank you for choosing Nova Residency!</p>
          <p><small>This is a computer-generated invoice.</small></p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
