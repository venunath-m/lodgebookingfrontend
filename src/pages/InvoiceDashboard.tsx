// "use client";
// import React, { useState, useEffect,useRef } from "react";
// import API from "../api/axios";
// import InvoiceForm from "./InvoiceForm";
// import "./InvoiceDashboard.css";
// import Layout from "../components/DashboardLayout";
// import { useAuth } from "../context/useAuth";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// interface InvoiceItem {
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
// }

// interface Invoice {
//   invoice_id: number;
//   booking_id: number;
//   totalAmount: number;
//   tax: number;
//   discount: number;
//   finalAmount: number;
//   createdBy: number;
//   createdAt: string;
//   updatedAt?: string;
//   isDeleted: boolean;
//   reason?: string;
//   items: InvoiceItem[];
// }

// interface RoomSummary {
//   roomName: string;
//   totalAmount: number;
//   totalTax: number;
//   totalDiscount: number;
//   finalAmount: number;
//   invoiceCount: number;
// }

// interface UserSummary {
//   userName: string;
//   totalAmount: number;
//   totalTax: number;
//   totalDiscount: number;
//   finalAmount: number;
//   invoiceCount: number;
// }

// interface ServiceSummary {
//   serviceName: string;
//   quantity: number;
//   subtotal: number;
// }

// const InvoiceDashboard: React.FC = () => {
//   const { token } = useAuth();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [filters, setFilters] = useState({ fromDate: "", toDate: "", userId: "" });

//   const [roomSummary, setRoomSummary] = useState<RoomSummary[]>([]);
//   const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
//   const [serviceSummary, setServiceSummary] = useState<ServiceSummary[]>([]);

//   const fetchInvoices = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const params: Record<string, string> = {};
//       if (filters.fromDate) params.from_date = filters.fromDate;
//       if (filters.toDate) params.to_date = filters.toDate;
//       if (filters.userId) params.user_id = filters.userId;

//       const res = await API.get("/reports/invoices", {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       setInvoices(res.data.invoices);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSummary = async () => {
//     if (!token) return;

//     try {
//       const params: Record<string, string> = {};
//       if (filters.fromDate) params.from_date = filters.fromDate;
//       if (filters.toDate) params.to_date = filters.toDate;

//       const res = await API.get("/reports/invoices-summary", {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       setRoomSummary(res.data.roomTotals);
//       setUserSummary(res.data.userTotals);
//       setServiceSummary(res.data.serviceTotals);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching summary");
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//     fetchSummary();
//   }, [token]);

//   const handleEdit = (id: number) => {
//     setSelectedInvoiceId(id);
//     setShowForm(true);
//   };

//   const handleCreate = () => {
//     setSelectedInvoiceId(null);
//     setShowForm(true);
//   };

//   const handleRefresh = () => {
//     fetchInvoices();
//     fetchSummary();
//   };

//   /** Download PDF */
// const selectedInvoice = selectedInvoiceId !== null
//   ? invoices.find((inv) => inv.invoice_id === selectedInvoiceId)
//   : null;

// const componentRef = useRef<HTMLDivElement | null>(null);
// const orientation: "portrait" | "landscape" = "portrait";

// const handleDownloadPDF = async () => {
//   if (!componentRef.current || !selectedInvoice) return;
//   const element = componentRef.current;
//   const canvas = await html2canvas(element, { scale: 2 });

//   const data = canvas.toDataURL("image/png");
//   const pdf = new jsPDF(orientation === "portrait" ? "p" : "l", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
//   pdf.save(`Invoice_${selectedInvoice.invoice_id}.pdf`);
// };


//   return (
//     <Layout>
//       <div className="dashboard-container">
//         <h1>Invoice Dashboard</h1>

//         <div className="summary-panel">
//           <div className="summary-section">
//             <h3>Room Summary</h3>
//             {roomSummary.map((r, idx) => (
//               <p key={idx}>
//                 <strong>{r.roomName}</strong>: {r.invoiceCount} invoices, Final Amount: {r.finalAmount}
//               </p>
//             ))}
//           </div>
//           <div className="summary-section">
//             <h3>User Summary</h3>
//             {userSummary.map((u, idx) => (
//               <p key={idx}>
//                 <strong>{u.userName}</strong>: {u.invoiceCount} invoices, Final Amount: {u.finalAmount}
//               </p>
//             ))}
//           </div>
//           <div className="summary-section">
//             <h3>Service Summary</h3>
//             {serviceSummary.map((s, idx) => (
//               <p key={idx}>
//                 <strong>{s.serviceName}</strong>: {s.quantity} times, Subtotal: {s.subtotal}
//               </p>
//             ))}
//           </div>
//         </div>

//         <div className="actions">
//           <button onClick={handleCreate}>Create Invoice</button>
//           <button onClick={handleRefresh}>Refresh</button>
//         </div>

//         <div className="filters">
//           <input
//             type="date"
//             value={filters.fromDate}
//             onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//             placeholder="From"
//           />
//           <input
//             type="date"
//             value={filters.toDate}
//             onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//             placeholder="To"
//           />
//           <input
//             type="number"
//             value={filters.userId}
//             onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
//             placeholder="User ID"
//           />
//           <button onClick={() => { fetchInvoices(); fetchSummary(); }}>Apply Filters</button>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="invoice-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Booking</th>
//                 <th>Total</th>
//                 <th>Tax</th>
//                 <th>Discount</th>
//                 <th>Final</th>
//                 <th>Created</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices.map((inv) => (
//                 <tr key={inv.invoice_id} className={inv.isDeleted ? "deleted" : ""}>
//                   <td>{inv.invoice_id}</td>
//                   <td>{inv.booking_id}</td>
//                   <td>{inv.totalAmount}</td>
//                   <td>{inv.tax}</td>
//                   <td>{inv.discount}</td>
//                   <td>{inv.finalAmount}</td>
//                   <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
//                   <td>
//                     <button onClick={() => handleEdit(inv.invoice_id)}>Edit</button>
//                     <button onClick={handleDownloadPDF}>Download PDF</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {showForm && (
//           <div className="modal">
//             <div className="modal-content">
//               <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
//               <InvoiceForm invoiceId={selectedInvoiceId || undefined} />
//             </div>
//           </div>
//         )}

//         {/* Hidden Printable Invoice */}
//       {selectedInvoice && (
//         <div
//           ref={componentRef}
//           className="invoice-print-area"
//           style={{
//             display: showPrintModal ? "none" : "block",
//             background: "#000",
//             padding: "30px",
//           }}
//         >
          
//         <div style={{ margin: "0 60px" }}>
//           <div className="invoice-header">
//             {includeLogo && (
//               <img src={companyLogo} alt="Company Logo" className="invoice-logo" />
//             )}
//             <div className="company-details">
//               <h2>Nova Residency</h2>
//               <p>123 Business Street, City, State</p>
//               <p>Email: info@company.com | Phone: +91 98765 43210</p>
//             </div>
//           </div>

//           <hr />

//           <div className="invoice-meta">
//             <p><strong>Invoice ID:</strong> {selectedInvoice.invoiceId}</p>
//             <p><strong>Booking ID:</strong> {selectedInvoice.bookingId}</p>
//             <p><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}</p>
//             <p><strong>User:</strong> {selectedInvoice.user}</p>
//           </div>

//           <table className="invoice-items-table">
//             <thead>
//               <tr >
//                 <th style={{backgroundColor:"#667eea"}}>Description</th>
//                 <th style={{backgroundColor:"#667eea"}}>Qty</th>
//                 <th style={{backgroundColor:"#667eea"}}>Unit Price</th>
//                 <th style={{backgroundColor:"#667eea"}}>Subtotal</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedInvoice.items.map((item, idx) => (
//                 <tr key={idx}>
//                   <td>{item.description}</td>
//                   <td>{item.quantity}</td>
//                   <td>₹{item.unitPrice}</td>
//                   <td>₹{item.subtotal}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="invoice-summary">
//             <p><strong>Total:</strong> ₹{selectedInvoice.totalAmount}</p>
//             <p><strong>Tax:</strong> ₹{selectedInvoice.tax}</p>
//             <p><strong>Discount:</strong> ₹{selectedInvoice.discount}</p>
//             <h3><strong>Final Amount:</strong> ₹{selectedInvoice.finalAmount}</h3>
//           </div>

//               <div className="invoice-terms" style={{ marginTop: "20px", textAlign: "left" }}>
//               <h4>Terms & Conditions</h4>
//               <p>• Full payment confirms booking.</p>
//               <p>• Check-in: 2:00 PM | Check-out: 11:00 AM.</p>
//               <p>• No cancellation or refund once booked.</p>
//               <p>• No smoking or alcohol allowed on the property.</p>
//               <p>• Damage to property will be charged to the guest.</p>
//               <p>• Extra guests not allowed beyond room capacity.</p>
//               <p>• Management not liable for loss of valuables.</p>
//             </div>


//           <div className="invoice-footer">
//             <p>Thank you for your business!</p>
//           </div>
          
//           </div>
//         </div>
//       )}
//       </div>
//     </Layout>
//   );
// };

// export default InvoiceDashboard;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "../assets/company-logo.png";
import "./InvoiceDashboard.css";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Invoice {
  invoice_id: number;
  booking_id: number;
  totalAmount: number;
  tax: number;
  discount: number;
  finalAmount: number;
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  reason?: string;
  items: InvoiceItem[];
  user?: string;
}

interface RoomSummary {
  roomName: string;
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  finalAmount: number;
  invoiceCount: number;
}

interface UserSummary {
  userName: string;
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  finalAmount: number;
  invoiceCount: number;
}

interface ServiceSummary {
  serviceName: string;
  quantity: number;
  subtotal: number;
}

const InvoiceDashboard: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", userId: "" });

  const [roomSummary, setRoomSummary] = useState<RoomSummary[]>([]);
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummary[]>([]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  /** Fetch invoices */
  const fetchInvoices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.fromDate) params.from_date = filters.fromDate;
      if (filters.toDate) params.to_date = filters.toDate;
      if (filters.userId) params.user_id = filters.userId;

      const res = await API.get("/reports/invoices", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  /** Fetch summaries */
  const fetchSummary = async () => {
    if (!token) return;
    try {
      const params: Record<string, string> = {};
      if (filters.fromDate) params.from_date = filters.fromDate;
      if (filters.toDate) params.to_date = filters.toDate;

      const res = await API.get("/reports/invoices-summary", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setRoomSummary(res.data.roomTotals || []);
      setUserSummary(res.data.userTotals || []);
      setServiceSummary(res.data.serviceTotals || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching summary");
    }
  };

  useEffect(() => {
    if (token) {
      fetchInvoices();
      fetchSummary();
    }
  }, [token]);

  /** Handlers */
  const handleCreate = () => {
    navigate("/invoices/create");
  };

  const handleEdit = (invoice: Invoice) => {
    navigate("/invoices/create", { state: { invoiceId: invoice.invoice_id } });
  };

  const handleDelete = async (id: number) => {
  const reason = prompt("Please provide a reason for deleting this invoice:");
  if (!reason) return; // user cancelled

  if (!confirm("Are you sure you want to delete this invoice?")) return;

  try {
    await API.request({
      url: `/invoices/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
      data: JSON.stringify({ reason }),
    });
    alert("Invoice deleted successfully!");
    fetchInvoices();
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.detail?.[0]?.msg || "Failed to delete invoice");
  }
};

  const handlePrint = (invoice: Invoice) => {
  setSelectedInvoice(invoice);

  setTimeout(() => {
    if (!componentRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice_${invoice.invoice_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 4px; }
            th { background-color: #667eea; color: #fff; }
          </style>
        </head>
        <body>${componentRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    setSelectedInvoice(null);
  }, 300);
};

const handleDownloadPDF = async (invoice: Invoice) => {
  setSelectedInvoice(invoice);

  setTimeout(async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, { scale: 5});
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${invoice.invoice_id}.pdf`);

    setSelectedInvoice(null);
  }, 300);
};


  return (
    <Layout>
      <div className="dashboard-container">
        <h1>Invoice Dashboard</h1>

        {/* Summaries */}
        <div className="summary-panel">
          <div className="summary-section">
            <h3>Room Summary</h3>
            {roomSummary.map((r, idx) => (
              <p key={idx}>
                <strong>{r.roomName}</strong>: {r.invoiceCount} invoices, Final Amount: {r.finalAmount}
              </p>
            ))}
          </div>
          <div className="summary-section">
            <h3>User Summary</h3>
            {userSummary.map((u, idx) => (
              <p key={idx}>
                <strong>{u.userName}</strong>: {u.invoiceCount} invoices, Final Amount: {u.finalAmount}
              </p>
            ))}
          </div>
          <div className="summary-section">
            <h3>Service Summary</h3>
            {serviceSummary.map((s, idx) => (
              <p key={idx}>
                <strong>{s.serviceName}</strong>: {s.quantity} times, Subtotal: {s.subtotal}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="actions" style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
          <button onClick={fetchInvoices} style={{ background: "#f59e0b", color: "#fff", padding: "5px 10px" }}>Refresh</button>
          <button onClick={handleCreate} style={{ background: "#16a34a", color: "#fff", padding: "5px 10px" }}>Create Invoice</button>
        </div>

        {/* Filters */}
        <div className="filters" style={{ marginBottom: "20px" }}>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            placeholder="From"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            placeholder="To"
          />
          <input
            type="number"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            placeholder="User ID"
          />
          <button onClick={() => { fetchInvoices(); fetchSummary(); }}>Apply Filters</button>
        </div>

        {/* Invoice Table */}
        <h2 style={{ textAlign: "center", margin: "50px 0" }}>🧾 Invoice List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="invoice-table" style={{tableLayout:"auto"}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking</th>
                <th>Total</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Final</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoice_id} className={inv.isDeleted ? "deleted" : ""}>
                  <td>{inv.invoice_id}</td>
                  <td>{inv.booking_id}</td>
                  <td>{inv.totalAmount}</td>
                  <td>{inv.tax}</td>
                  <td>{inv.discount}</td>
                  <td>{inv.finalAmount}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => handleEdit(inv)} style={{ flex: 1, background: "#3b82f6", color: "#fff" }}>Edit</button>
                      <button onClick={() => handleDelete(inv.invoice_id)} style={{ flex: 1, background: "#ef4444", color: "#fff" }}>Delete</button>
                      <button onClick={() => handlePrint(inv)} style={{ flex: 1, background: "#16a34a", color: "#fff" }}>Print</button>
                      <button onClick={() => handleDownloadPDF(inv)} style={{ flex: 1, background: "#10b981", color: "#fff" }}>PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Hidden Printable Invoice */}
        {selectedInvoice && (
          <div ref={componentRef} 
           style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            width: "210mm", // A4 width
            background: "#fff",
            color:"#000",
            padding: "20px",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif"
          }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "2px solid #3f445cff",
              paddingBottom: "10px"
            }}>
              <div>
                <img src={companyLogo} alt="Company Logo" style={{ height: "60px" }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <h3 style={{ margin: 0 }}>Nova Residency</h3>
                <p style={{ margin: "2px 0" }}>123 Business Street, City, State</p>
                <p style={{ margin: "2px 0" }}>Email: info@company.com | Phone: +91 98765 43210</p>
              </div>
            </div>
            <p><strong>Invoice ID:</strong> {selectedInvoice.invoice_id}</p>
            <p><strong>Booking ID:</strong> {selectedInvoice.booking_id}</p>
            <p><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}</p>
            <p><strong>User:</strong> {selectedInvoice.user}</p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
              <thead>
                <tr style={{ backgroundColor: "#667eea", color: "#fff" }}>
                  <th style={{ border: "1px solid #000", padding: "4px" }}>Description</th>
                  <th style={{ border: "1px solid #000", padding: "4px" }}>Qty</th>
                  <th style={{ border: "1px solid #000", padding: "4px" }}>Unit Price</th>
                  <th style={{ border: "1px solid #000", padding: "4px" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ border: "1px solid #000", padding: "4px" }}>{item.description}</td>
                    <td style={{ border: "1px solid #000", padding: "4px" }}>{item.quantity}</td>
                    <td style={{ border: "1px solid #000", padding: "4px" }}>₹{item.unitPrice}</td>
                    <td style={{ border: "1px solid #000", padding: "4px" }}>₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "15px" }}>
              <p><strong>Total:</strong> ₹{selectedInvoice.totalAmount}</p>
              <p><strong>Tax:</strong> ₹{selectedInvoice.tax}</p>
              <p><strong>Discount:</strong> ₹{selectedInvoice.discount}</p>
              <h3><strong>Final Amount:</strong> ₹{selectedInvoice.finalAmount}</h3>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4>Terms & Conditions</h4>
              <p>• Full payment confirms booking.</p>
              <p>• Check-in: 2:00 PM | Check-out: 11:00 AM.</p>
              <p>• No cancellation or refund once booked.</p>
              <p>• No smoking or alcohol allowed on the property.</p>
              <p>• Damage to property will be charged to the guest.</p>
              <p>• Extra guests not allowed beyond room capacity.</p>
              <p>• Management not liable for loss of valuables.</p>
            </div>

            <div className="invoice-footer" style={{ textAlign: "center", marginTop: "20px" }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDashboard;
