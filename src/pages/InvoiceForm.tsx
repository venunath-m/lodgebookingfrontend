

// "use client";
// import React, { useEffect, useState } from "react";
// import API from "../api/axios";
// import { useAuth } from "../context/useAuth";
// import Layout from "../components/DashboardLayout";
// import "./InvoiceForm.css";
// import { useNavigate } from "react-router-dom";

// interface Booking {
//   id: number;
//   status: string;
//   roomId: number;
//   startDate: string;
//   endDate: string;
// }

// interface Room {
//   id: number;
//   name: string;
//   type: string;
//   price: number;
//   description: string;
//   imageUrl: string;
// }

// interface InvoiceItem {
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
//   serviceId?: number | null;
// }

// interface InvoiceResponse {
//   invoiceId: number;
//   bookingId: number;
//   totalAmount: number;
//   tax: number;
//   discount: number;
//   finalAmount: number;
//   createdAt: string;
//   updatedAt: string;
//   reason?: string;
//   items: InvoiceItem[];
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
// }

// interface Props {
//   invoiceId?: number;
// }

// const InvoiceForm: React.FC<Props> = ({ invoiceId }) => {
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [filtered, setFiltered] = useState<Booking[]>([]);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [bookingId, setBookingId] = useState<number>(0);
//   const [items, setItems] = useState<InvoiceItem[]>([]);
//   const [tax, setTax] = useState<number>(0);
//   const [discount, setDiscount] = useState<number>(0);
//   const [reason, setReason] = useState<string>("");
//   const [finalAmount, setFinalAmount] = useState<number>(0);
//   const [invoiceSnapshot, setInvoiceSnapshot] = useState<InvoiceResponse | null>(null);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // 🧮 Recalculate final amount
//   useEffect(() => {
//     const total = items.reduce((sum, i) => sum + i.subtotal, 0);
//     setFinalAmount(total * tax - discount);
//   }, [items, tax, discount]);

//   // 📦 Fetch Bookings
//   const fetchBookings = async () => {
//     try {
//       const res = await API.get("/bookings/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.items)
//         ? res.data.items
//         : [];

//       console.log("📘 Bookings fetched:", data);
//       setBookings(data);
//       setFiltered(data);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//       setBookings([]);
//     }
//   };

//   // 🏨 Fetch Rooms
//   const fetchRooms = async () => {
//     try {
//       const res = await API.get("/rooms", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.items)
//         ? res.data.items
//         : [];

//       console.log("🏠 Rooms fetched:", data);
//       setRooms(data);
//     } catch (err) {
//       console.error("Error fetching rooms:", err);
//       setRooms([]);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchBookings();
//       fetchRooms();
//     }
//   }, [token]);

//   // 🧾 Load existing invoice for edit
//   useEffect(() => {
//     if (!invoiceId || !token) return;

//     API.get<InvoiceResponse>(`/invoices/${invoiceId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         const inv = res.data;
//         setInvoiceSnapshot(inv);
//         setBookingId(inv.bookingId);
//         setItems(inv.items || []);
//         setTax(inv.tax || 0);
//         setDiscount(inv.discount || 0);
//         setReason(inv.reason || "");
//       })
//       .catch((err) => {
//         console.error("Error loading invoice:", err);
//         alert("Error loading invoice");
//       });
//   }, [invoiceId, token]);

//   // 🔍 Filter Bookings by date
//   const handleFilter = () => {
//     let result = bookings;
//     if (fromDate)
//       result = result.filter((b) => new Date(b.startDate) >= new Date(fromDate));
//     if (toDate)
//       result = result.filter((b) => new Date(b.endDate) <= new Date(toDate));
//     setFiltered(result);
//   };

//   // 🧮 Update item
//   const handleItemChange = (index: number, field: string, value: string | number) => {
//     const newItems = [...items];
//     if (field === "description") newItems[index].description = String(value);
//     if (field === "quantity") newItems[index].quantity = Number(value);
//     if (field === "unitPrice") newItems[index].unitPrice = Number(value);
//     newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
//     setItems(newItems);
//   };

//   // ➕ Add new item
//   const addItem = () => {
//     setItems([...items, { description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
//   };

//   // ❌ Remove item
//   const removeItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   // 🏨 On selecting booking → add room automatically
//   const handleBookingSelect = (id: number) => {
//     setBookingId(id);
//     const selected = filtered.find((b) => b.id === id);
//     if (!selected) return;

//     const room = rooms.find((r) => r.id === Number(selected.roomId));
//     if (!room) {
//       alert("Room details not found for selected booking");
//       return;
//     }

//     const start = new Date(selected.startDate);
//     const end = new Date(selected.endDate);
//     const diffDays = Math.max(
//       1,
//       Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
//     );

//     const newItem: InvoiceItem = {
//       description: `Room: ${room.name}`,
//       quantity: diffDays,
//       unitPrice: room.price,
//       subtotal: diffDays * room.price,
//     };

//     setItems([newItem]);
//   };

//   // 💾 Submit Invoice
//   const handleSubmit = async () => {
//     if (!token) return alert("Not authenticated");
//     if (!bookingId) return alert("Please select a booking");

//     const payload = { bookingId, items, tax, discount, reason };

//     try {
//       let res;
//       if (invoiceId) {
//         if (!reason) return alert("Reason is required for edit");
//         res = await API.put(`/invoices/${invoiceId}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         res = await API.post("/invoices", payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       const newInvoice = res.data;
//       const newInvoiceId = invoiceId || newInvoice.invoiceId;
//       alert(`Invoice ${invoiceId ? "updated" : "created"} successfully!`);
//       navigate(`/invoice/preview/${newInvoiceId}`, {
//         state: { invoice: newInvoice },
//       });
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.detail || "Error creating/updating invoice");
//     }
//   };

//   // 🖥️ UI
//   return (
//     <Layout>
//       <div className="invoice-form-container">
//         <h2>{invoiceId ? "Edit Invoice" : "Create Invoice"}</h2>

//         {/* Filters */}
//         <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
//           <div>
//             <label>From: </label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>To: </label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div>
//           <button onClick={handleFilter} style={{ padding: "4px 10px" }}>
//             Apply Filter
//           </button>
//         </div>

//         {/* Booking Dropdown */}
//         <div className="form-group">
//           <label>Booking:</label>
//           <select
//             disabled={filtered.length === 0}
//             value={bookingId}
//             onChange={(e) => handleBookingSelect(Number(e.target.value))}
//           >
//             <option value={0}>-- Select Booking --</option>
//             {filtered.map((b) => (
//               <option key={b.id} value={b.id}>
//                 {`Booking #${b.id} | ${b.status} | ${b.startDate} → ${b.endDate}`}
//               </option>
//             ))}
//           </select>
//           {filtered.length === 0 && (
//             <p style={{ color: "#888" }}>No bookings found — check filter or token</p>
//           )}
//         </div>

//         {/* Items Table */}
//         <h3>Items</h3>
//         <table className="invoice-items-table">
//           <thead>
//             <tr style={{ color: "#667eea" }}>
//               <th>Description</th>
//               <th>Qty</th>
//               <th>Unit Price</th>
//               <th>Subtotal</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, idx) => (
//               <tr key={idx}>
//                 <td>
//                   <input
//                     type="text"
//                     value={item.description}
//                     onChange={(e) =>
//                       handleItemChange(idx, "description", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     min={1}
//                     value={item.quantity}
//                     onChange={(e) =>
//                       handleItemChange(idx, "quantity", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     min={0}
//                     value={item.unitPrice}
//                     onChange={(e) =>
//                       handleItemChange(idx, "unitPrice", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>{item.subtotal}</td>
//                 <td>
//                   <button onClick={() => removeItem(idx)}>Remove</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <button onClick={addItem}>Add Item</button>

//         {/* Tax & Discount */}
//         <div className="form-group">
//           <label>Tax:</label>
//           <input
//             type="number"
//             min={0}
//             value={tax}
//             onChange={(e) => setTax(Number(e.target.value))}
//           />
//         </div>
//         <div className="form-group">
//           <label>Discount:</label>
//           <input
//             type="number"
//             min={0}
//             value={discount}
//             onChange={(e) => setDiscount(Number(e.target.value))}
//           />
//         </div>

//         {invoiceId && (
//           <div className="form-group">
//             <label>Reason for Edit:</label>
//             <input
//               type="text"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//             />
//           </div>
//         )}

//         <h3>Final Amount: ₹{finalAmount}</h3>
//         <button className="submit-btn" onClick={handleSubmit}>
//           {invoiceId ? "Update" : "Create"} Invoice
//         </button>

//         {invoiceSnapshot && (
//           <div className="invoice-preview">
//             <h3>Invoice Preview</h3>
//             <p><b>Customer:</b> {invoiceSnapshot.customerName}</p>
//             <p><b>Mobile:</b> {invoiceSnapshot.mobile}</p>
//             <p>
//               <b>Room:</b> {invoiceSnapshot.room} ({invoiceSnapshot.roomNo})
//             </p>
//             <p>
//               <b>Check-in:</b> {invoiceSnapshot.checkInDate}{" "}
//               {invoiceSnapshot.checkInTime}
//             </p>
//             <p>
//               <b>Check-out:</b> {invoiceSnapshot.checkOutDate}{" "}
//               {invoiceSnapshot.checkOutTime}
//             </p>
//             <p>
//               <b>Final Amount:</b> ₹{invoiceSnapshot.finalAmount}
//             </p>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default InvoiceForm;

"use client";
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import "./InvoiceForm.css";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: number;
  status: string;
  roomId: number;
  startDate: string;
  endDate: string;
}

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  serviceId?: number | null;
}

interface InvoiceResponse {
  invoiceId: number;
  bookingId: number;
  totalAmount: number;
  tax: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
  reason?: string;
  items: InvoiceItem[];
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
}

interface Props {
  invoiceId?: number;
}

const InvoiceForm: React.FC<Props> = ({ invoiceId }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookingId, setBookingId] = useState<number>(0);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [invoiceSnapshot, setInvoiceSnapshot] = useState<InvoiceResponse | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🧮 Recalculate final amount
  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const taxAmount = (total * tax) / 100;
    setFinalAmount(total + taxAmount - discount);

  }, [items, tax, discount]);
  useEffect(() => {
    const fetchNextInvoiceNumber = async (bookingId?: number) => {
      if (!token) return;

      try {
        const res = await API.get("/invoices/next-number", {
          headers: { Authorization: `Bearer ${token}` },
          params: bookingId ? { booking_id: bookingId } : {},
        });
        setNextInvoiceNumber(res.data.invoiceNumber);
      } catch (err) {
        console.error("Error fetching next invoice number", err);
      }
    };

    // Fetch number initially if creating new invoice
    if (!invoiceId) fetchNextInvoiceNumber(bookingId);
  }, [token, bookingId, invoiceId]);
  // 📦 Fetch Bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
          ? res.data.items
          : [];

      console.log("📘 Bookings fetched:", data);
      setBookings(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  // 🏨 Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
          ? res.data.items
          : [];

      console.log("🏠 Rooms fetched:", data);
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchRooms();
    }
  }, [token]);

  // 🧾 Load existing invoice for edit
  useEffect(() => {
    if (!invoiceId || !token) return;

    API.get<InvoiceResponse>(`/invoices/${invoiceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const inv = res.data;
        setInvoiceSnapshot(inv);
        setBookingId(inv.bookingId);
        setItems(inv.items || []);
        setTax(inv.tax || 0);
        setDiscount(inv.discount || 0);
        setReason(inv.reason || "");
      })
      .catch((err) => {
        console.error("Error loading invoice:", err);
        alert("Error loading invoice");
      });
  }, [invoiceId, token]);

  // 🔍 Filter Bookings by date
  const handleFilter = () => {
    let result = bookings;
    if (fromDate)
      result = result.filter((b) => new Date(b.startDate) >= new Date(fromDate));
    if (toDate)
      result = result.filter((b) => new Date(b.endDate) <= new Date(toDate));
    setFiltered(result);
  };

  // 🧮 Update item
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === "description") newItems[index].description = String(value);
    if (field === "quantity") newItems[index].quantity = Number(value);
    if (field === "unitPrice") newItems[index].unitPrice = Number(value);
    newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
    setItems(newItems);
  };

  // ➕ Add new item
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  // ❌ Remove item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // 🏨 On selecting booking → add room automatically
  const handleBookingSelect = (id: number) => {
    setBookingId(id);
    const selected = filtered.find((b) => b.id === id);
    if (!selected) return;

    const room = rooms.find((r) => r.id === Number(selected.roomId));
    if (!room) {
      alert("Room details not found for selected booking");
      return;
    }

    const start = new Date(selected.startDate);
    const end = new Date(selected.endDate);
    const diffDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    const newItem: InvoiceItem = {
      description: `Room: ${room.name}`,
      quantity: diffDays,
      unitPrice: room.price,
      subtotal: diffDays * room.price,
    };

    setItems([newItem]);
  };

  // 💾 Submit Invoice
  const handleSubmit = async () => {
    if (!token) return alert("Not authenticated");
    if (!bookingId) return alert("Please select a booking");

    const payload = { bookingId, items, tax, discount, reason };

    try {
      let res;
      if (invoiceId) {
        if (!reason) return alert("Reason is required for edit");
        res = await API.put(`/invoices/${invoiceId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await API.post("/invoices", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const newInvoice = res.data;
      const newInvoiceId = invoiceId || newInvoice.invoiceId;
      alert(`Invoice ${invoiceId ? "updated" : "created"} successfully!`);
      navigate(`/invoice/preview/${newInvoiceId}`, {
        state: { invoice: newInvoice },
      });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error creating/updating invoice");
    }
  };

  // 🖥️ UI
  return (
    <Layout>
      <div className="invoice-form-container">
        <h2>{invoiceId ? "Edit Invoice" : "Create Invoice"}</h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <label>From: </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label>To: </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button onClick={handleFilter} style={{ marginTop:"22px" }}>
            Apply Filter
          </button>
        </div>

        {/* Booking Dropdown */}
        <div className="form-group">
          <label>Booking:</label>
          <select
            disabled={filtered.length === 0}
            value={bookingId}
            onChange={(e) => handleBookingSelect(Number(e.target.value))}
          >
            <option value={0}>-- Select Booking --</option>
            {filtered.map((b) => (
              <option key={b.id} value={b.id}>
                {`Booking #${b.id} | ${b.status} | ${b.startDate} → ${b.endDate}`}
              </option>
            ))}
          </select>
          {!invoiceId && (
            <div className="form-group">
              <label>Invoice Number:</label>
              <input type="text" value={nextInvoiceNumber} disabled />
            </div>
          )}

          {filtered.length === 0 && (
            <p style={{ color: "#888" }}>No bookings found — check filter or token</p>
          )}
        </div>

        {/* Items Table */}
        <h3>Items</h3>
        <table className="invoice-items-table">
          <thead>
            <tr style={{ color: "#667eea" }}>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(idx, "description", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, "unitPrice", e.target.value)
                    }
                  />
                </td>
                <td>{item.subtotal}</td>
                <td>
                  <button onClick={() => removeItem(idx)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem}>Add Item</button>

        {/* Tax & Discount */}
        <div className="form-group">
          <label>Tax:</label>
          <input
            type="number"
            min={0}
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Discount:</label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        {invoiceId && (
          <div className="form-group">
            <label>Reason for Edit:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}

        <h3>Final Amount: ₹{finalAmount}</h3>
        <button className="submit-btn" onClick={handleSubmit}>
          {invoiceId ? "Update" : "Create"} Invoice
        </button>

        {invoiceSnapshot && (
          <div className="invoice-preview">
            <h3>Invoice Preview</h3>
            <p><b>Customer:</b> {invoiceSnapshot.customerName}</p>
            <p><b>Mobile:</b> {invoiceSnapshot.mobile}</p>
            <p>
              <b>Room:</b> {invoiceSnapshot.room} ({invoiceSnapshot.roomNo})
            </p>
            <p>
              <b>Check-in:</b> {invoiceSnapshot.checkInDate}{" "}
              {invoiceSnapshot.checkInTime}
            </p>
            <p>
              <b>Check-out:</b> {invoiceSnapshot.checkOutDate}{" "}
              {invoiceSnapshot.checkOutTime}
            </p>
            <p>
              <b>Final Amount:</b> ₹{invoiceSnapshot.finalAmount}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceForm;
