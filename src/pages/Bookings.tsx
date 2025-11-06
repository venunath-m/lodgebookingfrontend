"use client";
import { useEffect, useState } from "react";
import API from "../api/axios";
import type { Booking, Room } from "../types";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import BookingDialog from "../components/BookingDialog";
import DevOnly from "../context/DevOnly";

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

  // ✅ New: track which booking is expanded
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);
  const handleToggleMore = (id: number) => {
    setExpandedBookingId((prev) => (prev === id ? null : id));
  };

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
    if (fromDate) result = result.filter((b) => new Date(b.startDate) >= new Date(fromDate));
    if (toDate) result = result.filter((b) => new Date(b.endDate) <= new Date(toDate));
    setFiltered(result);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const displayed = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / bookingsPerPage);

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (data: any) => {
  if (!selectedBooking) return;
  if (!data.roomId) return alert("Please select a room");

  try {
    const formData = new FormData();
    formData.append("roomId", String(data.roomId));
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("males", String(data.males));
    formData.append("females", String(data.females));
    formData.append("name", data.name ?? "");
    formData.append("mobile", data.mobile ?? "");
    formData.append("address", data.address ?? "");
    formData.append("checkInDate", data.checkInDate ?? "");
    formData.append("checkInTime", data.checkInTime ?? "");
    formData.append("checkOutDate", data.checkOutDate ?? "");
    formData.append("checkOutTime", data.checkOutTime ?? "");
    formData.append("customerGstNo", data.customerGstNo ?? "");
    formData.append("roomNo", data.roomNo ?? "");
    formData.append("numberOfDates", String(data.numberOfDates ?? 0));
    formData.append("totalNoPeople", String(data.totalNoPeople ?? 0));
    formData.append("bookingSource", data.bookingSource ?? "Walk In");
    formData.append("paymentMethod", data.paymentMethod ?? "");
    formData.append("safe", String(data.safe ?? false));

    if (data.document) {
      formData.append("document", data.document);
    }

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
    <DevOnly>
      <Layout>
        <div className="admin-rooms-page">
          <h1 style={{ fontSize: "1.5rem", marginBottom: 16 }}>My Bookings</h1>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <label>From: </label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label>To: </label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <button onClick={handleFilter} style={{ padding: "4px 10px" }}>
              Apply
            </button>
          </div>

          {/* Booking list */}
          {displayed.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            displayed.map((b) => {
              const room = rooms.find((r) => r.id === b.roomId);
              const documentUrl = b.documentUrl
                ? b.documentUrl.startsWith("http")
                  ? b.documentUrl
                  : `${API.defaults.baseURL}${b.documentUrl}`
                : null;

              const isExpanded = expandedBookingId === b.id;

              return (
                <div
                  key={b.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    marginBottom: 12,
                    padding: 12,
                  }}
                >
                  <h3>{room?.name || "No room assigned"}</h3>
                  <p>Booking Id: {b.id}</p>
                  <p>From: {b.startDate}</p>
                  <p>To: {b.endDate}</p>
                  <p>Status: {b.status}</p>
                  <p>Males: {b.males ?? 0}</p>
                  <p>Females: {b.females ?? 0}</p>

                  {documentUrl && (
                    <p>
                      Proof:{" "}
                      <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </p>
                  )}

                  <button onClick={() => handleEditBooking(b)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      style={{ backgroundColor: "red", color: "#fff", marginRight: 8 }}
                    >
                      Cancel
                    </button>
                  )}

                  {/* More button */}
                  <button onClick={() => handleToggleMore(b.id)} style={{ backgroundColor: "#2563eb", color: "#fff", marginRight: 8 }}>
                    {isExpanded ? "Hide" : "More"}
                  </button>

                  {/* Expanded section */}
                  {isExpanded && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 4,
                    }}
                  >
                    <p>Customer Name: {b.name || "N/A"}</p>
                    <p>Total People: {b.totalNoPeople}</p>
                    <p>Booking Source: {b.bookingSource || "N/A"}</p>
                    <p>Customer GST No: {b.customerGstNo || "N/A"}</p>
                    <p>Check-In Date: {b.checkInDate || "N/A"}</p>
                    <p>Check-In Time: {b.checkInTime || "N/A"}</p>
                    <p>Check-Out Date: {b.checkOutDate || "N/A"}</p>
                    <p>Check-Out Time: {b.checkOutTime || "N/A"}</p>
                    <p>Number of Nights: {b.numberOfDates}</p>
                  </div>
                )}
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 16,
                gap: 8,
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ⬅ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next ➡
              </button>
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
                name: selectedBooking.name || "",
                mobile: selectedBooking.mobile || "",
                address: selectedBooking.address || "",
                customerGstNo: selectedBooking.customerGstNo || "",
                roomNo: selectedBooking.roomNo || "",
                numberOfNights: selectedBooking.numberOfNights || 0,
                totalNoPeople: selectedBooking.totalNoPeople || 0,
                bookingSource: selectedBooking.bookingSource || "Walk In",
                paymentMethod: selectedBooking.paymentMethod || "",
                safe: selectedBooking.safe ?? false,
                checkinDateTime: selectedBooking.checkinDateTime || "",
                checkoutDateTime: selectedBooking.checkoutDateTime || "",
              }}
              rooms={rooms}
            />
          )}
        </div>
      </Layout>
    </DevOnly>
  );
}
