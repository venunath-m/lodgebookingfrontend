"use client";
import { useEffect, useState } from "react";
import API from "../api/axios";
import type { Booking, Room } from "../types";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import BookingDialog from "../components/BookingDialog";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const { token } = useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Booking[] = Array.isArray(res.data.items) ? res.data.items : [];
      setBookings(data);
      setFiltered(data);

      console.log("Total bookings fetched:", data.length);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setFiltered([]);
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchRooms();
    }
  }, [token]);

  // Filters
  const handleFilter = () => {
    let result = bookings;
    if (fromDate) result = result.filter(b => new Date(b.startDate) >= new Date(fromDate));
    if (toDate) result = result.filter(b => new Date(b.endDate) <= new Date(toDate));
    setFiltered(result);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const displayed = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / bookingsPerPage);

  console.log("Filtered bookings:", filtered.length);
  console.log("Current page:", currentPage, "Total pages:", totalPages);
  console.log("Displayed bookings:", displayed.length);

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (data: {
    roomId?: number;
    startDate: string;
    endDate: string;
    males: number;
    females: number;
    document?: File;
  }) => {
    if (!selectedBooking) return;
    if (!data.roomId) return alert("Please select a room");

    try {
      const formData = new FormData();
      formData.append("roomId", String(data.roomId));
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("males", String(data.males));
      formData.append("females", String(data.females));
      if (data.document) formData.append("document", data.document);

      await API.put(`/bookings/${selectedBooking.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking updated successfully!");
      setOpenEditDialog(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update booking");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await API.post(`/bookings/${bookingId}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Booking cancelled!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  return (
    <Layout>
      <div className="admin-rooms-page">
        <h1 style={{ fontSize: "1.5rem", marginBottom: 16 }}>My Bookings</h1>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <label>From: </label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div>
            <label>To: </label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <button onClick={handleFilter} style={{ padding: "4px 10px" }}>Apply</button>
        </div>

        {/* Booking list */}
        {displayed.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          displayed.map(b => {
            const room = rooms.find(r => r.id === b.roomId);

            const documentUrl = b.documentUrl
              ? b.documentUrl.startsWith("http")
                ? b.documentUrl
                : `${API.defaults.baseURL}${b.documentUrl}`
              : null;

            return (
              <div key={b.id} style={{ border: "1px solid #ccc", borderRadius: 6, marginBottom: 12, padding: 12 }}>
                <h3>{room?.name || "No room assigned"}</h3>
                <p>From: {b.startDate}</p>
                <p>To: {b.endDate}</p>
                <p>Status: {b.status}</p>
                <p>Males: {b.males ?? 0}</p>
                <p>Females: {b.females ?? 0}</p>

                {documentUrl && (
                  <p>
                    Proof: <a href={documentUrl} target="_blank" rel="noopener noreferrer">View Document</a>
                  </p>
                )}

                <button onClick={() => handleEditBooking(b)} style={{ marginRight: 8 }}>Edit</button>
                {b.status !== "cancelled" && (
                  <button onClick={() => handleCancelBooking(b.id)} style={{ backgroundColor: "red", color: "#fff" }}>Cancel</button>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16, gap: 8 }}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>⬅ Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next ➡</button>
          </div>
        )}

        {/* Edit Booking Dialog */}
        {selectedBooking && (
          <BookingDialog
            isOpen={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            onConfirm={handleEditSubmit}
            initialData={{
              roomId: selectedBooking.roomId,
              startDate: selectedBooking.startDate,
              endDate: selectedBooking.endDate,
              males: selectedBooking.males ?? 0,
              females: selectedBooking.females ?? 0,
            }}
            rooms={rooms}
          />
        )}
      </div>
    </Layout>
  );
}
