"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Room } from "../types";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    startDate: string;
    endDate: string;
    males: number;
    females: number;
    document?: File;
    roomId?: number;
    name?: string;
    mobile?: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    customerGstNo?: string;
    roomNo?: string;
    numberOfDates?: number;
    totalNoPeople?: number;
    bookingSource?: string;
    safe?: boolean;
  }) => void;
  rooms?: Room[];
  initialData?: any;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  rooms,
  initialData,
}) => {
  const [roomId, setRoomId] = useState<number>(initialData?.roomId || 0);
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [males, setMales] = useState(initialData?.males || 0);
  const [females, setFemales] = useState(initialData?.females || 0);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);

  // ✅ New Fields
  const [name, setName] = useState(initialData?.name || "");
  const [mobile, setMobile] = useState(initialData?.mobile || "");
  const [checkInDate, setCheckInDate] = useState(initialData?.checkInDate || "");
  const [checkInTime, setCheckInTime] = useState(initialData?.checkInTime || "");
  const [checkOutDate, setCheckOutDate] = useState(initialData?.checkOutDate || "");
  const [checkOutTime, setCheckOutTime] = useState(initialData?.checkOutTime || "");
  const [customerGstNo, setCustomerGstNo] = useState(initialData?.customerGstNo || "");
  const [roomNo, setRoomNo] = useState(initialData?.roomNo || "");
  const [numberOfDates, setNumberOfDates] = useState(initialData?.numberOfDates || 0);
  const [totalNoPeople, setTotalNoPeople] = useState(initialData?.totalNoPeople || 0);
  const [bookingSource, setBookingSource] = useState(initialData?.bookingSource || "");
  const [safe, setSafe] = useState(initialData?.safe || false);

  // ✅ Keep form synced when dialog reopens
  useEffect(() => {
    if (!isOpen) return;
    setRoomId(initialData?.roomId || 0);
    setStartDate(initialData?.startDate || "");
    setEndDate(initialData?.endDate || "");
    setMales(initialData?.males || 0);
    setFemales(initialData?.females || 0);
    setName(initialData?.name || "");
    setMobile(initialData?.mobile || "");
    setCheckInDate(initialData?.checkInDate || "");
    setCheckInTime(initialData?.checkInTime || "");
    setCheckOutDate(initialData?.checkOutDate || "");
    setCheckOutTime(initialData?.checkOutTime || "");
    setCustomerGstNo(initialData?.customerGstNo || "");
    setRoomNo(initialData?.roomNo || "");
    setNumberOfDates(initialData?.numberOfDates || 0);
    setTotalNoPeople(initialData?.totalNoPeople || 0);
    setBookingSource(initialData?.bookingSource || "");
    setSafe(initialData?.safe || false);
  }, [isOpen, initialData]);

  const handleConfirm = () => {
    if (!startDate || !endDate) return alert("Please select start and end dates");
    onConfirm({
      startDate,
      endDate,
      males,
      females,
      document: uploadedDocument || undefined,
      roomId: roomId || undefined,
      name,
      mobile,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      customerGstNo,
      roomNo,
      numberOfDates,
      totalNoPeople,
      bookingSource,
      safe,
    });
    onClose();
  };

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

        {/* ✅ Room Dropdown */}
        {rooms && (
          <>
            <label className="block text-sm font-medium text-gray-700">Room</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(Number(e.target.value))}
              className="border rounded p-2 mb-3 w-full"
            >
              <option value={0}>Select a room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || r.name}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="grid grid-cols-1 gap-3">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded p-2" />

          <label>Mobile</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="border rounded p-2" />

          <label>Check-In Date</label>
          <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="border rounded p-2" />

          <label>Check-In Time</label>
          <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="border rounded p-2" />

          <label>Check-Out Date</label>
          <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="border rounded p-2" />

          <label>Check-Out Time</label>
          <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="border rounded p-2" />

          <label>Customer GST No</label>
          <input value={customerGstNo} onChange={(e) => setCustomerGstNo(e.target.value)} className="border rounded p-2" />

          <label>Room No</label>
          <input value={roomNo} onChange={(e) => setRoomNo(e.target.value)} className="border rounded p-2" />

          <label>Number of Dates</label>
          <input type="number" value={numberOfDates} onChange={(e) => setNumberOfDates(Number(e.target.value))} className="border rounded p-2" />

          <label>Total No. of People</label>
          <input type="number" value={totalNoPeople} onChange={(e) => setTotalNoPeople(Number(e.target.value))} className="border rounded p-2" />

          <label>Booking Source</label>
          <input value={bookingSource} onChange={(e) => setBookingSource(e.target.value)} className="border rounded p-2" />

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} />
            Safe Booking
          </label>

          {/* ✅ File upload */}
          <label>Upload Document</label>
          <input
            type="file"
            onChange={(e) => setUploadedDocument(e.target.files?.[0] || null)}
            className="border rounded p-2"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default BookingDialog;
