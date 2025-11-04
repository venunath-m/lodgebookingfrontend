"use client";
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import "./InvoiceForm.css";
import { useNavigate } from "react-router-dom";
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
  isDeleted?: boolean;

  // Snapshot fields
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

  // Items
  items: InvoiceItem[];
}

interface Props {
  invoiceId?: number;
}

const InvoiceForm: React.FC<Props> = ({ invoiceId }) => {
  const { token } = useAuth();
  const [bookingId, setBookingId] = useState<number>(0);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [invoiceSnapshot, setInvoiceSnapshot] = useState<InvoiceResponse | null>(null);
  const navigate = useNavigate();
  // calculate final amount
  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    setFinalAmount(total + tax - discount);
  }, [items, tax, discount]);

  // load invoice for edit
  useEffect(() => {
    if (!invoiceId || !token) return;

    API.get<InvoiceResponse>(`/invoices/${invoiceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const inv = res.data;
        setInvoiceSnapshot(inv);
        setBookingId(inv.bookingId);
        setItems(inv.items);
        setTax(inv.tax);
        setDiscount(inv.discount);
        setReason(inv.reason || "");
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading invoice");
      });
  }, [invoiceId, token]);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === "description") newItems[index].description = String(value);
    if (field === "quantity") newItems[index].quantity = Number(value);
    if (field === "unitPrice") newItems[index].unitPrice = Number(value);
    newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
    setItems(newItems);
  };

  const addItem = () =>
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async () => {
  if (!token) return alert("Not authenticated");

  const payload = { bookingId, items, tax, discount };

  try {
    let res;
    if (invoiceId) {
      if (!reason) return alert("Reason is required for edit");
      res = await API.put(
        `/invoices/${invoiceId}`,
        { ...payload, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      res = await API.post("/invoices", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    const newInvoice = res.data; // full invoice data from backend
    const newInvoiceId = invoiceId || newInvoice.invoiceId;

    alert(`Invoice ${invoiceId ? "updated" : "created"} successfully!`);

    // ✅ Pass the entire invoice object to the preview via state
    navigate(`/invoice/preview/${newInvoiceId}`, { state: { invoice: newInvoice } });

  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error) {
      alert(err.message);
    } else if (typeof err === "object" && err !== null && "response" in err) {
      const response = (err as { response?: { data?: { detail?: string } } }).response;
      alert(response?.data?.detail || "Error creating/updating invoice");
    } else {
      alert("Error creating/updating invoice");
    }
  }
};

  return (
    <Layout>
      <div className="invoice-form-container">
        <h2>{invoiceId ? "Edit Invoice" : "Create Invoice"}</h2>

        <div className="form-group">
          <label>Booking ID:</label>
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(Number(e.target.value))}
          />
        </div>

        <h3>Items</h3>
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
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

        <h3>Final Amount: {finalAmount}</h3>
        <button className="submit-btn" onClick={handleSubmit}>
          {invoiceId ? "Update" : "Create"} Invoice
        </button>

        {invoiceSnapshot && (
          <div className="invoice-preview">
            <h3>Invoice Preview</h3>
            <p><b>Customer:</b> {invoiceSnapshot.customerName}</p>
            <p><b>Mobile:</b> {invoiceSnapshot.mobile}</p>
            <p><b>Room:</b> {invoiceSnapshot.room} ({invoiceSnapshot.roomNo})</p>
            <p><b>Check-in:</b> {invoiceSnapshot.checkInDate} {invoiceSnapshot.checkInTime}</p>
            <p><b>Check-out:</b> {invoiceSnapshot.checkOutDate} {invoiceSnapshot.checkOutTime}</p>
            <p><b>Final Amount:</b> ₹{invoiceSnapshot.finalAmount}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceForm;
