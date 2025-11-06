// import React, { forwardRef } from "react";
// import "./PrintableInvoice.css";
// import companyLogo from "../assets/company-logo.png";
// interface InvoiceItem {
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
// }

// interface Invoice {
//   invoice_id: number;
//   booking_id: number;
//   user: string | number;
//   totalAmount: number;
//   tax: number;
//   discount: number;
//   finalAmount: number;
//   createdAt: string;
//   items: InvoiceItem[];
// }

// interface PrintableInvoiceProps {
//   invoice: Invoice;
// }

// const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(({ invoice }, ref) => {
//   return (
//     <div ref={ref} className="printable-invoice">
//       <div className="invoice-header">       
//          <img src={companyLogo} alt="Company Logo" className="company-logo" />
//         <div className="company-details">
//           <h2>Novo Residency</h2>
//           <p>123 Main Street, Kochi, Kerala - 682001</p>
//           <p>Email: support@mybooking.com | Phone: +91 99999 99999</p>
//         </div>
//       </div>

//       <hr />

//       <div className="invoice-meta" style={{margin:"0 30px"}}>
//         <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
//         <p><strong>Booking ID:</strong> {invoice.booking_id}</p>
//         <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
//       </div>

//       <table className="invoice-items" style={{margin:"0 30px"}}>
//         <thead>
//           <tr>
//             <th>Description</th>
//             <th>Qty</th>
//             <th>Unit Price</th>
//             <th>Subtotal</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoice.items.map((item, idx) => (
//             <tr key={idx}>
//               <td>{item.description}</td>
//               <td>{item.quantity}</td>
//               <td>₹{item.unitPrice.toFixed(2)}</td>
//               <td>₹{item.subtotal.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="invoice-summary">
//         <p><strong>Total:</strong> ₹{invoice.totalAmount.toFixed(2)}</p>
//         <p><strong>Tax:</strong> ₹{invoice.tax.toFixed(2)}</p>
//         <p><strong>Discount:</strong> ₹{invoice.discount.toFixed(2)}</p>
//         <h3><strong>Final Amount:</strong> ₹{invoice.finalAmount.toFixed(2)}</h3>
//       </div>

//       <div className="invoice-footer">
//         <p>Thank you for choosing Nova Residency!</p>
//         <p><small>This is a computer-generated invoice.</small></p>
//       </div>
//     </div>
//   );
// });

// export default PrintableInvoice;


import React, { forwardRef } from "react";
import "./PrintableInvoice.css";
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
  items: InvoiceItem[];
}

interface PrintableInvoiceProps {
  invoice: Invoice;
}

const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(({ invoice }, ref) => {
  return (
    <div ref={ref} className="printable-invoice">
      {/* Header */}
      <div className="invoice-header">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <div className="company-details">
          <h2>Novo Residency</h2>
          <p>123 Main Street, Kochi, Kerala - 682001</p>
          <p>Email: support@mybooking.com | Phone: +91 99999 99999</p>
        </div>
      </div>

      <hr />

      {/* Meta */}
      <div className="invoice-meta" style={{ margin: "0 30px" }}>
        <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
        <p><strong>Booking ID:</strong> {invoice.booking_id}</p>
        <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Items Table */}
      <table className="invoice-items" style={{ margin: "0 30px" }}>
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

      {/* Terms & Conditions */}
      <div className="invoice-terms" style={{ margin: "20px 30px", fontSize: "12px" }}>
        <h4>Terms & Conditions</h4>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <li>Full payment confirms booking.</li>
          <li>Check-in: 2:00 PM | Check-out: 11:00 AM</li>
          <li>No cancellation or refund once booked.</li>
          <li>No smoking or alcohol allowed on the property.</li>
          <li>Damage to property will be charged to the guest.</li>
          <li>Extra guests not allowed beyond room capacity.</li>
          <li>Management not liable for loss of valuables.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <p>Thank you for choosing Nova Residency!</p>
        <p><small>This is a computer-generated invoice.</small></p>
      </div>
    </div>
  );
});

export default PrintableInvoice;
