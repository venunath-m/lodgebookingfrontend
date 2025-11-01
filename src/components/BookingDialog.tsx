"use client";
import { useEffect, useState } from "react";
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
    roomId?: number; // optional for new bookings
  }) => void;
  rooms?: Room[]; // optional, only needed for editing
  initialData?: {
    roomId?: number;
    startDate: string;
    endDate: string;
    males: number;
    females: number;
  };
}

const BookingDialog = ({ isOpen, onClose, onConfirm, rooms, initialData }: BookingDialogProps) => {
  const [roomId, setRoomId] = useState<number>(initialData?.roomId || 0);
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [males, setMales] = useState(initialData?.males || 1);
  const [females, setFemales] = useState(initialData?.females || 0);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setRoomId(initialData?.roomId || 0);
      setStartDate(initialData?.startDate || "");
      setEndDate(initialData?.endDate || "");
      setMales(initialData?.males || 1);
      setFemales(initialData?.females || 0);
      setUploadedDocument(null);
      setPreviewUrl(null);
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadedDocument(file || null);

    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleConfirm = () => {
    if (!startDate || !endDate) return alert("Please select dates.");
    if (rooms && rooms.length > 0 && !roomId) return alert("Please select a room."); // enforce only for editing
    onConfirm({
      startDate,
      endDate,
      males,
      females,
      document: uploadedDocument || undefined,
      roomId: roomId || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay show">
      <div className="modal-card show max-w-lg">
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

        {rooms && rooms.length > 0 && (
          <>
            <label>Room</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(Number(e.target.value))}
              className="w-full mb-3 border rounded px-2 py-1"
            >
              <option value={0}>Select a room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full mb-3 border rounded px-2 py-1"
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full mb-3 border rounded px-2 py-1"
        />

        <label>Number of Males</label>
        <input
          type="number"
          min="0"
          value={males}
          onChange={(e) => setMales(Number(e.target.value))}
          className="w-full mb-3 border rounded px-2 py-1"
        />

        <label>Number of Females</label>
        <input
          type="number"
          min="0"
          value={females}
          onChange={(e) => setFemales(Number(e.target.value))}
          className="w-full mb-3 border rounded px-2 py-1"
        />

        <label>Upload Document (optional)</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="w-full mb-3"
        />

        {previewUrl && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-28 h-20 object-cover rounded border"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
