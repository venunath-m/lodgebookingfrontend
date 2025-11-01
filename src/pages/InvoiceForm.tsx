"use client"
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import "./InvoiceForm.css";
import Layout from "../components/DashboardLayout";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  serviceId?: number | null;
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

  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    setFinalAmount(total + tax - discount);
  }, [items, tax, discount]);

  useEffect(() => {
  if (!invoiceId || !token) return;

  interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    serviceId?: number | null;
  }

  interface InvoiceResponse {
    invoice_id: number;
    booking_id: number;
    items: InvoiceItem[];
    tax: number;
    discount: number;
  }

  API.get<InvoiceResponse[]>("/invoices", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      const inv = res.data.find((i) => i.invoice_id === invoiceId);
      if (inv) {
        setBookingId(inv.booking_id);
        setItems(inv.items.map((it) => ({ ...it })));
        setTax(inv.tax);
        setDiscount(inv.discount);
      }
    })
    .catch((err: unknown) => {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        alert(response?.data?.detail || "Error fetching invoice");
      } else {
        alert("Error fetching invoice");
      }
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

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

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
    alert(`Invoice ${invoiceId ? "updated" : "created"} successfully. Final: ${res.data.finalAmount}`);
  } catch (err: unknown) {
    console.error(err);

    // Narrow the error type safely
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
          <input type="number" value={bookingId} onChange={(e) => setBookingId(Number(e.target.value))} />
        </div>
        <h3>Items</h3>
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td><input type="text" value={item.description} onChange={(e) => handleItemChange(idx, "description", e.target.value)} /></td>
                <td><input type="number" min={1} value={item.quantity} onChange={(e) => handleItemChange(idx, "quantity", e.target.value)} /></td>
                <td><input type="number" min={0} value={item.unitPrice} onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)} /></td>
                <td>{item.subtotal}</td>
                <td><button onClick={() => removeItem(idx)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addItem}>Add Item</button>
        <div className="form-group">
          <label>Tax:</label>
          <input type="number" min={0} value={tax} onChange={(e) => setTax(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Discount:</label>
          <input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>
        {invoiceId && (
          <div className="form-group">
            <label>Reason for Edit:</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        )}
        <h3>Final Amount: {finalAmount}</h3>
        <button className="submit-btn" onClick={handleSubmit}>{invoiceId ? "Update" : "Create"} Invoice</button>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
