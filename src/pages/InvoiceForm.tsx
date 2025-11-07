"use client";
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import { useNavigate, useLocation } from "react-router-dom";
import "./InvoiceForm.css";

interface Booking {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  room?: {
    id: number;
    name: string;
    price: number;
  };
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
  items: InvoiceItem[];
  tax: number;
  discount: number;
  finalAmount: number;
  reason?: string;
  invoiceNumber: string;
}

const InvoiceForm: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const stateInvoice = (location.state as any)?.invoice as InvoiceResponse;

  // State
  const [invoiceId] = useState<number | null>(stateInvoice?.invoiceId || null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState<number | null>(stateInvoice?.bookingId || null);
  const [items, setItems] = useState<InvoiceItem[]>(stateInvoice?.items || []);
  const [tax, setTax] = useState<number>(stateInvoice?.tax || 0);
  const [discount, setDiscount] = useState<number>(stateInvoice?.discount || 0);
  const [reason, setReason] = useState<string>(stateInvoice?.reason || "");
  const [finalAmount, setFinalAmount] = useState<number>(stateInvoice?.finalAmount || 0);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>("");

  // Recalculate final amount whenever items, tax, or discount change
  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const taxAmount = (total * tax) / 100;
    setFinalAmount(Number((total + taxAmount - discount).toFixed(2)));
  }, [items, tax, discount]);

  // Fetch bookings
  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await API.get("/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Booking[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
          ? res.data.items
          : [];
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  // Fetch next invoice number
  const fetchNextInvoiceNumber = async (bookingId?: number) => {
    if (!token) return;
    try {
      const res = await API.get("/invoices/next-number", {
        headers: { Authorization: `Bearer ${token}` },
        params: bookingId ? { booking_id: bookingId } : {},
      });
      setNextInvoiceNumber(res.data.invoiceNumber);
    } catch (err) {
      console.error("Error fetching next invoice number:", err);
    }
  };

  // Load initial data
  useEffect(() => {
    if (!token) return;
    fetchBookings();
    if (!invoiceId) fetchNextInvoiceNumber();
  }, [token]);

  // Auto-select booking and populate items when editing
  useEffect(() => {
  if (!bookings.length) return;
  if (invoiceId && stateInvoice) {
    // Use existing invoice items
    setBookingId(stateInvoice.bookingId);
    setItems(stateInvoice.items || []);
    return; // STOP here, don’t recalc from booking
  }

  if (stateInvoice?.bookingId) {
    const selectedBooking = bookings.find(b => b.id === stateInvoice.bookingId);
    if (!selectedBooking) return;
    setBookingId(selectedBooking.id);

    const start = new Date(selectedBooking.startDate);
    const end = new Date(selectedBooking.endDate);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    setItems([
      {
        description: `Room: ${selectedBooking.room?.name || ""}`,
        quantity: diffDays,
        unitPrice: selectedBooking.room?.price || 0,
        subtotal: diffDays * (selectedBooking.room?.price || 0),
      },
    ]);

    if (!invoiceId) fetchNextInvoiceNumber(selectedBooking.id);
  }
}, [bookings, stateInvoice, invoiceId]);

  // Handle booking selection from dropdown
  const handleBookingSelect = (id: number) => {
    const selected = bookings.find(b => b.id === id);
    if (!selected || !selected.room) return;

    setBookingId(id);

    const start = new Date(selected.startDate);
    const end = new Date(selected.endDate);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    setItems([
      {
        description: `Room: ${selected.room.name}`,
        quantity: diffDays,
        unitPrice: selected.room.price,
        subtotal: diffDays * selected.room.price,
      },
    ]);

    if (!invoiceId) fetchNextInvoiceNumber(id);
  };

  // Update individual item
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === "description") newItems[index].description = String(value);
    if (field === "quantity") newItems[index].quantity = Number(value) || 1;
    if (field === "unitPrice") newItems[index].unitPrice = Number(value) || 0;
    newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  // Submit invoice
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
      navigate(`/invoice/preview/${newInvoiceId}`, { state: { invoice: newInvoice } });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error creating/updating invoice");
    }
  };

  return (
    <Layout>
      <div className="invoice-form-container">
        <h2>{invoiceId ? "Edit Invoice" : "Create Invoice"}</h2>

        {/* Booking Dropdown */}
        <div className="form-group">
          <label>Booking:</label>
          <select
            value={bookingId || ""}
            onChange={(e) => handleBookingSelect(Number(e.target.value))}
          >
            <option value="">-- Select Booking --</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {`Booking #${b.id} | ${b.status} | Room: ${b.room?.name || b.room || "N/A"} | ${b.startDate} → ${b.endDate}`}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice Number */}
        <div className="form-group">
          <label>Invoice Number:</label>
          <input
            type="text"
            value={invoiceId ? stateInvoice?.invoiceNumber : nextInvoiceNumber}
            disabled
          />
        </div>

        {/* Items Table */}
        <h3>Items</h3>
        <table className="invoice-items-table">
          <thead>
            <tr>
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
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
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
          <label>Tax (%):</label>
          <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Discount:</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>

        {invoiceId && (
          <div className="form-group">
            <label>Reason for Edit:</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        )}

        <h3>Final Amount: ₹{finalAmount}</h3>
        <button className="submit-btn" onClick={handleSubmit}>
          {invoiceId ? "Update" : "Create"} Invoice
        </button>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
