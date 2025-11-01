"use client";
import { useEffect, useState } from "react";
import API from "../api/axios";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types";
import { useAuth } from "../context/useAuth";
import Layout from "../components/DashboardLayout";
import "../App.css";
import BookingDialog from "../components/BookingDialog";
import DevOnly from "../context/DevOnly";
type RoomStatus = "booked" | "vacant" | "cancelled";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { token } = useAuth();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;

  // booking dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // store room statuses
  const [roomStatuses, setRoomStatuses] = useState<Record<number, RoomStatus>>({});

  // ✅ Open booking dialog
  const handleBook = (roomId: number) => {
    setSelectedRoomId(roomId);
    setOpenDialog(true);
  };

  // ✅ Handle dialog confirm
  const handleDialogSubmit = async (data: {
    startDate: string;
    endDate: string;
    males: number;
    females: number;
    document?: File;
  }) => {
    if (!selectedRoomId) return;

    try {
      const formData = new FormData();
      formData.append("roomId", String(selectedRoomId));
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("males", String(data.males));
      formData.append("females", String(data.females));
      if (data.document) formData.append("document", data.document);

      await API.post("/bookings", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booked successfully!");
      setOpenDialog(false);

      // Update room status to booked
      setRoomStatuses((prev) => ({
        ...prev,
        [selectedRoomId]: "booked",
      }));
    } catch (err: unknown) {
      type AxiosErrorResponse = {
        response?: { data?: { detail?: string } };
      };
      const error = err as AxiosErrorResponse;
      alert(error?.response?.data?.detail ?? "Booking failed");
    }
  };

  // ✅ Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchRooms();
  }, [token]);

  // ✅ Fetch bookings & populate room statuses
useEffect(() => {
  const fetchBookedRooms = async () => {
    try {
      const res = await API.get("/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      type BookingItem = { roomId: number; status: string }; // status comes from API
      const bookingsArray: BookingItem[] = Array.isArray(res.data.items)
        ? res.data.items
        : [];

      const statusMap: Record<number, RoomStatus> = {};
      bookingsArray.forEach((b) => {
        let status: RoomStatus = "vacant"; // default

        if (b.status === "confirmed" || b.status === "booked") status = "booked";
        else if (b.status === "cancelled") status = "cancelled";

        statusMap[b.roomId] = status;

        // 🔹 Debug log
        console.log(`Room ID: ${b.roomId}, API Status: ${b.status}, Mapped Status: ${status}`);
      });

      setRoomStatuses(statusMap);
    } catch (err) {
      console.error("Error fetching booked rooms:", err);
      setRoomStatuses({});
    }
  };

  if (token) fetchBookedRooms();
}, [token]);


  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const displayedRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  return (
    <DevOnly>
    <Layout>
      <div className="admin-rooms-page">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Available Rooms
        </h1>

        {displayedRooms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No rooms available.</p>
        ) : (
          <>
            <div className="rooms-grid">
  {displayedRooms.map((room) => {
    const status = roomStatuses[room.id] || "vacant"; // fallback to vacant

    // Treat cancelled as available
    const booked = status === "booked";
    const cancelled = status === "cancelled";

    return (
      <RoomCard
        key={room.id}
        room={room}
        onBook={handleBook}
        booked={booked}
        cancelled={cancelled}
      />
    );
  })}
</div>



            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
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
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDialogSubmit}
      />
    </Layout>
    </DevOnly>
  );
}
