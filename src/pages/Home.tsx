"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import "../App.css";
import BookingDialog from "../components/BookingDialog";
import DevOnly from "../context/DevOnly";
import { useInvoice } from "./InvoiceContext"; // ✅ Import context
import CashClosingDialog from "../components/CashClosingDialog";

type RoomStatus = "booked" | "vacant" | "cancelled";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { setInvoice } = useInvoice(); // ✅ Context setter

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [roomStatuses, setRoomStatuses] = useState<Record<number, RoomStatus>>({});
  const [cashDialogOpen, setCashDialogOpen] = useState(false);

  // ✅ Handle Booking
  const handleBook = (roomId: number) => {
    setSelectedRoomId(roomId);
    setOpenDialog(true);
  };

  // ✅ Handle Booking Submit
  const handleDialogSubmit = async (data: any) => {
    if (!selectedRoomId) return;

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value as any);
      });

      const res = await API.post("/bookings", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const booking = res.data;
      setOpenDialog(false);
      alert("Booked successfully!");

      const bookedRoom = rooms.find((r) => r.id === selectedRoomId);

        const invoiceData = {
          invoice_id: booking.id || Math.floor(Math.random() * 10000),
          booking_id: booking.id,
          createdAt: booking.createdAt || new Date().toISOString(),
          customerName: booking.name || data.name || "Guest",
          mobile: booking.mobile || data.mobile || "N/A",
          address: booking.address || data.address || "",
          totalAmount: booking.totalPrice || bookedRoom?.price || 0,
          tax: booking.tax || 0,
          discount: booking.discount || 0,
          finalAmount: booking.totalPrice || bookedRoom?.price || 0,
          checkInDate: booking.startDate || data.startDate,
          checkOutDate: booking.endDate || data.endDate,
          room: booking.room?.name || bookedRoom?.name || "Room",
          items: [
            {
              description: booking.room?.name || bookedRoom?.name || "Room",
              quantity: 1,
              unitPrice: bookedRoom?.price || 0,
              subtotal: bookedRoom?.price || 0,
            },
          ],
        };
        
      setInvoice(invoiceData); // ✅ Save to context
      navigate("/invoice-preview"); // No need to pass state
      setRoomStatuses((prev) => ({ ...prev, [selectedRoomId]: "booked" }));
    } catch (err: unknown) {
      console.error(err);
      const error = err as any;
      alert(error?.response?.data?.detail ?? "Booking failed");
    }
  };

  // ✅ Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/rooms", { headers: { Authorization: `Bearer ${token}` } });
        setRooms(res.data);
        setFilteredRooms(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchRooms();
  }, [token]);

  // ✅ Fetch Booked Rooms
  useEffect(() => {
    const fetchBookedRooms = async () => {
      try {
        const res = await API.get("/bookings/me", { headers: { Authorization: `Bearer ${token}` } });
        const statusMap: Record<number, RoomStatus> = {};
        (res.data.items || []).forEach((b: any) => {
          let status: RoomStatus = "vacant";
          if (b.status === "confirmed" || b.status === "booked") status = "booked";
          else if (b.status === "cancelled") status = "cancelled";
          statusMap[b.roomId] = status;
        });
        setRoomStatuses(statusMap);
      } catch (err) {
        console.error(err);
        setRoomStatuses({});
      }
    };
    if (token) fetchBookedRooms();
  }, [token]);

  // ✅ Search functionality
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        String(room.name ?? "").toLowerCase().includes(query)
    );
    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [searchQuery, rooms]);

  // ✅ Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const displayedRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  return (
    <DevOnly>
      <Layout>
        <div className="admin-rooms-page">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Available Rooms
          </h1>

            {/* Search + Cash Closing Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "0 8rem",
                marginBottom: "1.5rem",
                boxSizing: "border-box",
              }}
            >
              {/* Search Input - Left */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by room name or number..."
                style={{
                  flex: "1",
                  maxWidth: "220px",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  outline: "none",
                }}
              />

              {/* Cash Closing Button - Right */}
              <button
                onClick={() => setCashDialogOpen(true)}
                style={{
                  backgroundColor: "#16a34a",
                  color: "white",
                  fontWeight: "500",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "1rem", // ✅ adds small gap between input and button
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#15803d")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
              >
                Day Closing
              </button>
            </div>


          {displayedRooms.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No rooms found.</p>
          ) : (
            <>
              <div className="rooms-grid mt-5">
                {displayedRooms.map((room) => {
                  const status = roomStatuses[room.id] || "vacant";
                  return (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onBook={handleBook}
                      booked={status === "booked"}
                      cancelled={status === "cancelled"}
                    />
                  );
                })}
              </div>

              {/* ✅ Pagination */}
              <div className="flex justify-center mt-6 gap-2"style={{marginTop:"25px"}}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* ✅ Booking Dialog */}
        <BookingDialog
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleDialogSubmit}
          token={token}
        />

        <CashClosingDialog
          isOpen={cashDialogOpen}
          onClose={() => setCashDialogOpen(false)}
          onSuccess={() => navigate("/cash-closing-report")}
          token={token}
        />

      </Layout>
    </DevOnly>
  );
}
