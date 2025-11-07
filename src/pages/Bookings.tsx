
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
  const bookingsPerPage = 12;

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
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
    } catch (err) {
      console.error(err);
      setBookings([]);
      setFiltered([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms", { headers: { Authorization: `Bearer ${token}` } });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
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

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenViewDialog(true);
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

  const handleEditSubmit = async (data: any) => {
    if (!selectedBooking) return;
    if (!data.roomId) return alert("Please select a room");

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value));
      });
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

  return (
    <DevOnly>
      <Layout>
        <div className="admin-rooms-page">
          <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>

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
            <button onClick={handleFilter} style={{marginTop:"22px" }}>
              Apply
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Booking ID</th>
                  <th className="p-2 border">Room</th>
                  <th className="p-2 border">From</th>
                  <th className="p-2 border">To</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Males</th>
                  <th className="p-2 border">Females</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center">No bookings found.</td>
                  </tr>
                ) : (
                  displayed.map((b) => {
                    const room = rooms.find((r) => r.id === b.roomId);
                    return (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{b.id}</td>
                        <td className="p-2 border">{room?.name || "N/A"}</td>
                        <td className="p-2 border">{b.startDate}</td>
                        <td className="p-2 border">{b.endDate}</td>
                        <td className="p-2 border">{b.status}</td>
                        <td className="p-2 border">{b.males ?? 0}</td>
                        <td className="p-2 border">{b.females ?? 0}</td>
                        <td className="p-2 border" style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
                          <button onClick={() => handleViewBooking(b)} className="bg-blue-600 text-white px-2 py-1 rounded text-sm"style={{background:"#16a34a",color:"#fff"}}>View</button>
                          <button onClick={() => handleEditBooking(b)} className="bg-green-600 text-white px-2 py-1 rounded text-sm" style={{background:"#2563eb",color:"#fff"}}>Edit</button>
                          {b.status !== "cancelled" && (
                            <button onClick={() => handleCancelBooking(b.id)} className="bg-red-600 text-white px-2 py-1 rounded text-sm"style={{background:"#dc2626",color:"#fff"}}>Cancel</button>
                          )}
                          
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-4"style={{marginTop:"25px"}}>
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded">⬅ Prev</button>
              <span className="px-2 py-1">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">Next ➡</button>
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
                numberOfDates: selectedBooking.numberOfDates ?? 0,
                totalNoPeople: selectedBooking.totalNoPeople ?? 0,
                bookingSource: selectedBooking.bookingSource || "Walk In",
                paymentMethod: selectedBooking.paymentMethod || "",
                safe: selectedBooking.safe ?? false,
                checkInDate: selectedBooking.checkInDate || "",
                checkInTime: selectedBooking.checkInTime || "",
                checkOutDate: selectedBooking.checkOutDate || "",
                checkOutTime: selectedBooking.checkOutTime || "",
              }}
              rooms={rooms}
            />
          )}

          {/* View Booking Dialog (read-only) */}
          {selectedBooking && openViewDialog && (
            <BookingDialog
              isOpen={openViewDialog}
              onClose={() => setOpenViewDialog(false)}
              onConfirm={() => {}}
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
                numberOfDates: selectedBooking.numberOfDates ?? 0,
                totalNoPeople: selectedBooking.totalNoPeople ?? 0,
                bookingSource: selectedBooking.bookingSource || "Walk In",
                paymentMethod: selectedBooking.paymentMethod || "",
                safe: selectedBooking.safe ?? false,
                checkInDate: selectedBooking.checkInDate || "",
                checkInTime: selectedBooking.checkInTime || "",
                checkOutDate: selectedBooking.checkOutDate || "",
                checkOutTime: selectedBooking.checkOutTime || "",
              }}
              rooms={rooms}
              info={true}
            />
          )}
        </div>
      </Layout>
    </DevOnly>
  );
}

          