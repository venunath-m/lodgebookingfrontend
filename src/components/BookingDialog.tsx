

"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Room } from "../types";
import API from "../api/axios";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  initialData?: any;
  token: string;
  info?: boolean;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
  token,
  info
}) => {
  const nowISO = new Date().toISOString().slice(0, 16);

  // Booking & customer states
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState<number>(initialData?.roomId || 0);
  const [roomSearch, setRoomSearch] = useState("");
  const [roomNo, setRoomNo] = useState(initialData?.roomNo || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [males, setMales] = useState(initialData?.males || 0);
  const [females, setFemales] = useState(initialData?.females || 0);
  const [totalNoPeople, setTotalNoPeople] = useState(initialData?.totalNoPeople || 0);
  const [numberOfNights, setNumberOfNights] = useState(initialData?.numberOfNights || 0);
  const [bookingNumber, setBookingNumber] = useState(initialData?.bookingNumber || "");


  const [name, setName] = useState(initialData?.name || "");
  const [mobile, setMobile] = useState(initialData?.mobile || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [checkinDateTime, setCheckinDateTime] = useState(initialData?.checkinDateTime || nowISO);
  const [checkoutDateTime, setCheckoutDateTime] = useState(initialData?.checkoutDateTime || nowISO);
  const [customerGstNo, setCustomerGstNo] = useState(initialData?.customerGstNo || "");
  const [bookingSource, setBookingSource] = useState(initialData?.bookingSource || "Walk In");
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || "");
  const [safe, setSafe] = useState(initialData?.safe || false);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch rooms from API
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
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms([]);
    }
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    setRoomId(initialData?.roomId || 0);
    setRoomNo(initialData?.roomNo || "");
    setRoomSearch("");
    setStartDate(initialData?.startDate || "");
    setEndDate(initialData?.endDate || "");
    setMales(initialData?.males || 0);
    setFemales(initialData?.females || 0);
    setTotalNoPeople(initialData?.totalNoPeople || 0);
    setNumberOfNights(initialData?.numberOfNights || 0);

    setName(initialData?.name || "");
    setMobile(initialData?.mobile || "");
    setAddress(initialData?.address || "");
    setCheckinDateTime(initialData?.checkinDateTime || nowISO);
    setCheckoutDateTime(initialData?.checkoutDateTime || nowISO);
    setCustomerGstNo(initialData?.customerGstNo || "");
    setBookingSource(initialData?.bookingSource || "Walk In");
    setPaymentMethod(initialData?.paymentMethod || "");
    setSafe(initialData?.safe || false);
    setUploadedDocument(null);
    setPreviewUrl(null);

    fetchRooms();
  }, [isOpen, initialData]);

  // Auto total people
  useEffect(() => {
    setTotalNoPeople(males + females);
  }, [males, females]);

  // Auto calculate number of nights
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMs = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      setNumberOfNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [startDate, endDate]);

  // Update roomNo when roomId changes
  useEffect(() => {
    if (rooms && roomId) {
      const selectedRoom = rooms.find((r) => r.id === roomId);
      setRoomNo(selectedRoom?.name || "");
    } else {
      setRoomNo("");
    }
  }, [roomId, rooms]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedDocument(file);
    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleConfirm = () => {
    if (!name || !mobile || !startDate || !endDate || !roomId) {
      alert("Please fill required fields: Name, Mobile, Start Date, End Date, Room");
      return;
    }

    const now = new Date().toISOString().slice(0, 16);

    const formatDateTime = (dtStr: string) => {
      let dt: Date;
      if (!dtStr) {
        dt = new Date();
      } else {
        dt = new Date(dtStr);
      }

      if (isNaN(dt.getTime())) dt = new Date();

      return {
        date: dt.toISOString().split("T")[0],
        time: dt.toTimeString().split(" ")[0],
      };
    };

    const { date: checkInDate, time: checkInTime } = formatDateTime(checkinDateTime || now);
    const { date: checkOutDate, time: checkOutTime } = formatDateTime(checkoutDateTime || now);

    onConfirm({
      bookingNumber, 
      roomId,
      roomNo,
      startDate,
      endDate,
      males,
      females,
      totalNoPeople,
      numberOfDates: numberOfNights,
      name,
      mobile,
      address,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      customerGstNo,
      bookingSource,
      paymentMethod,
      safe,
      document: uploadedDocument || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const labelStyle: React.CSSProperties = { display: "block", marginTop: 15, fontWeight: 500 };
  const radioContainerStyle = { display: "flex", alignItems: "center", gap: 15, marginLeft: 50 };

  // ✅ Improved room search — matches by name, type, or partial number
  const filteredRooms = rooms.filter((r) => {
    const query = roomSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      r.name?.toLowerCase().includes(query) ||
      r.type?.toLowerCase().includes(query) 
    );
  });

  return createPortal(
    <div className="modal-overlay show">
      <div className="modal-card show max-w-lg" style={{ minWidth: 800 }}>
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

        {/* Searchable Room Dropdown */}
        <label style={labelStyle}>Room *</label>
        <input
          type="text"
          placeholder="Search by room name, number, or type..."
          value={roomSearch}
          onChange={(e) => setRoomSearch(e.target.value)}
          className="w-full mb-2 border rounded px-2 py-1"
        />
        <select
          value={roomId}
          onChange={(e) => setRoomId(Number(e.target.value))}
          className="w-full mb-3 border rounded px-2 py-1"
          disabled={info}
        >
          <option value={0}>Select a room</option>
          {filteredRooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — ₹{r.price}
            </option>
          ))}
        </select>

        {/* Customer & Booking Fields */}

        <label style={labelStyle}>Booking Number</label>
        <input
          value={bookingNumber}
          onChange={(e) => setBookingNumber(e.target.value)}
          className="w-full mb-3 border rounded px-2 py-1"
          disabled
        />

        <label style={labelStyle}>Customer Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} disabled={info}className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>Mobile Number *</label>
        <input value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={info} className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>Customer Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={info} style={{ width: "100%" }} rows={3} />

        <label style={labelStyle}>Start Date *</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={info} className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>End Date *</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={info}className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>Check-in Date & Time</label>
        <input type="datetime-local" value={checkinDateTime} onChange={(e) => setCheckinDateTime(e.target.value)} disabled={info} className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>Check-out Date & Time</label>
        <input type="datetime-local" disabled={info} value={checkoutDateTime} onChange={(e) => setCheckoutDateTime(e.target.value)} className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>No. of Males</label>
        <input type="number" value={males} min={0} onChange={(e) => setMales(Number(e.target.value))} disabled={info} className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>No. of Females</label>
        <input type="number" value={females} min={0} onChange={(e) => setFemales(Number(e.target.value))} disabled={info} className="w-full mb-3 border rounded px-2 py-1" />

        <label style={labelStyle}>Total No. of People</label>
        <input type="number" value={totalNoPeople} disabled className="w-full mb-3 border rounded px-2 py-1 bg-gray-100" />

        <label style={labelStyle}>Number of Nights</label>
        <input type="text" value={numberOfNights} disabled className="w-full mb-3 border rounded px-2 py-1 bg-gray-100" />

        <label style={labelStyle}>Customer GST No</label>
        <input value={customerGstNo} disabled={info} onChange={(e) => setCustomerGstNo(e.target.value)} className="w-full mb-3 border rounded px-2 py-1" />

        {/* Payment Mode */}
        <label style={labelStyle}>Payment Mode (optional)</label>
        <div style={radioContainerStyle}>
          {["Cash", "UPI", "Online"].map((mode) => (
            <label key={mode} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <input type="radio" name="paymentMode" value={mode} checked={paymentMethod === mode} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: 13, height: 13 }} disabled={info}/>
              {mode}
            </label>
          ))}
        </div>

        {/* Booking Source */}
        <label style={labelStyle}>Booking Source</label>
        <div style={radioContainerStyle}>
          {["Online", "Walk In"].map((source) => (
            <label key={source} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <input type="radio" name="bookingSource" value={source} checked={bookingSource === source} onChange={(e) => setBookingSource(e.target.value)} style={{ width: 13, height: 13 }} disabled={info} />
              {source}
            </label>
          ))}
        </div>

        {/* Safe checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 12 }}>
          <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} style={{ width: 16, height: 16 }} disabled={info}/>
          <span>Safe Booking</span>
        </label>

        {/* Upload Document */}
        <label style={labelStyle}>Upload Document (optional)</label>
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} disabled={info} className="w-full mb-3 border rounded px-2 py-1" />
        {previewUrl && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img src={previewUrl} alt="Preview" className="w-28 h-20 object-cover rounded border" />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button  onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            Cancel
          </button>
          {!info && 
          <button disabled={info} onClick={handleConfirm} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Confirm
          </button>}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default BookingDialog;
