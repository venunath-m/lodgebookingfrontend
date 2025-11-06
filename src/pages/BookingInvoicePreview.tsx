// "use client";
// import React, { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useInvoice } from "./InvoiceContext"; 
// import './BookingInvoicePreview.css';

// const BookingInvoicePreview: React.FC = () => {
//   const { invoice } = useInvoice();
//   const navigate = useNavigate();
//   const printRef = useRef<HTMLDivElement>(null);

//   if (!invoice) {
//     return (
//       <div className="p-8">
//         <p>No invoice data found.</p>
//         <button onClick={() => navigate(-1)} className="btn mt-4">Go Back</button>
//       </div>
//     );
//   }

//   const handleDownloadPDF = async () => {
//     if (!printRef.current) return;
//     const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
//     pdf.save(`Invoice_${invoice.invoice_id}.pdf`);
//   };

//   return (
//     <div className="modal-overlay show">
//       <div className="modal-card show max-w-4xl">
//         <div className="toolbar">
//           <h2>Invoice Preview</h2>
//           <div className="toolbar-buttons">
//             <button onClick={() => window.print()} className="btn print-btn">🖨️ Print</button>
//             <button onClick={handleDownloadPDF} className="btn pdf-btn">💾 PDF</button>
//             <button onClick={() => navigate(-1)} className="btn close-btn">✖ Close</button>
//           </div>
//         </div>

//         <div ref={printRef} className="printable-invoice">
//           <h3>Invoice ID: {invoice.invoice_id}</h3>
//           <p><strong>Customer:</strong> {invoice.name}</p>
//           <p><strong>Mobile:</strong> {invoice.mobile}</p>
//           <p><strong>Address:</strong> {invoice.address}</p>
//           <p><strong>Room:</strong> {invoice.room}</p>
//           <p><strong>Date of Booking:</strong> {invoice.startDate}</p>
//           <p><strong>Date of Leaving:</strong> {invoice.endDate}</p>
//           <p><strong>Check-In:</strong> {invoice.checkInDate}</p>
//           <p><strong>Check-Out:</strong> {invoice.checkOutDate}</p>

//           <table className="invoice-table">
//             <thead>
//               <tr>
//                 <th>Description</th>
//                 <th>Qty</th>
//                 <th>Unit Price</th>
//                 <th>Subtotal</th>
//               </tr> 
//             </thead>
//             <tbody>
//               {invoice.items.map((item: any, i: number) => (
//                 <tr key={i}>
//                   <td>{item.description}</td>
//                   <td>{item.quantity}</td>
//                   <td>{item.unitPrice}</td>
//                   <td>{item.subtotal}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <p><strong>Total:</strong> {invoice.totalAmount}</p>
//           <p><strong>Tax:</strong> {invoice.tax}</p>
//           <p><strong>Discount:</strong> {invoice.discount}</p>
//           <p><strong>Final Amount:</strong> {invoice.finalAmount}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingInvoicePreview;


"use client";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useInvoice } from "./InvoiceContext";
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
    const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${invoice.invoice_id}.pdf`);
  };

  // Normalize room (string or object)
  const room =
    typeof invoice.room === "object" && invoice.room !== null
      ? invoice.room
      : { name: invoice.room, price: invoice.totalAmount || 0, type: "-" };

  // ✅ Calculate derived values
  const unitPrice = room.price || invoice.totalAmount || 0;
  const nights = invoice.numberOfDates || 1;
  const subtotal = unitPrice * nights;
  const tax = invoice.tax || 0;
  const discount = invoice.discount || 0;
  const finalAmount = invoice.finalAmount !== undefined
  ? invoice.finalAmount
  : subtotal + tax - discount;

  return (
    <div className="modal-overlay show">
      <div className="modal-card show max-w-4xl">
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

        {/* Invoice Body */}
        <div ref={printRef} className="printable-invoice">
          <h3>Invoice ID: {invoice.invoice_id || invoice.id}</h3>
          <p>
            <strong>Customer Name:</strong> {invoice.customerName || invoice.name || "N/A"}
          </p>
          <p>
            <strong>Mobile:</strong> {invoice.mobile || "N/A"}
          </p>
          {invoice.customerGstNo && (
            <p>
              <strong>GST No:</strong> {invoice.customerGstNo}
            </p>
          )}
          <p>
            <strong>Booking Source:</strong> {invoice.bookingSource || "N/A"}
          </p>
          <p>
            <strong>Safe Locker Used:</strong> {invoice.safe ? "Yes" : "No"}
          </p>

          <hr className="my-3" />

          {/* Room Details */}
          <h4>Room Details</h4>
          <p>
            <strong>Room No:</strong> {room.name || "N/A"}
          </p>
          <p>
            <strong>Type:</strong> {room.type || "N/A"}
          </p>
          <p>
            <strong>Rate:</strong> ₹{unitPrice.toFixed(2)} / night
          </p>

          <hr className="my-3" />

          {/* Dates */}
          <h4>Booking Period</h4>
          <p>
            <strong>Check-In Date:</strong> {invoice.checkInDate || invoice.startDate}
          </p>
          <p>
            <strong>Check-In Time:</strong> {invoice.checkInTime || "-"}
          </p>
          <p>
            <strong>Check-Out Date:</strong> {invoice.checkOutDate || invoice.endDate}
          </p>
          <p>
            <strong>Check-Out Time:</strong> {invoice.checkOutTime || "-"}
          </p>
          <p>
            <strong>Total Nights:</strong> {nights}
          </p>

          <hr className="my-3" />

          {/* Price Summary */}
          <h4>Price Summary</h4>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty (Nights)</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{room.name || "Room Booking"}</td>
                <td>{nights}</td>
                <td>₹{unitPrice.toFixed(2)}</td>
                <td>₹{subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <p>
            <strong>Total People:</strong> {invoice.totalNoPeople || 0}
          </p>
          <p>
            <strong>Tax:</strong> ₹{tax.toFixed(2)}
          </p>
          <p>
            <strong>Discount:</strong> ₹{discount.toFixed(2)}
          </p>

          <hr className="my-3" />

          <h3>
            <strong>Final Amount:</strong> ₹{finalAmount.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default BookingInvoicePreview;

