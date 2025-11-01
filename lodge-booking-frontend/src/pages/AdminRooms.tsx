"use client";
import { useEffect, useState ,useRef  } from "react";
import API from "../api/axios";
import type { Room } from "../types";
import { useAuth } from "../context/useAuth";
import RoomCard from "../components/RoomCard";
import Layout from "../components/DashboardLayout";
import "../App.css";
import { PencilSquareIcon, TrashIcon, ArrowRightOnRectangleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import DevOnly from "../context/DevOnly";
interface RoomFormData {
  id?: number;
  name: string;
  type: string;
  price: number;
  description: string;
  image?: File | null;
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { token } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    type: "",
    price: 0,
    description: "",
    image: null,
  });

  // fetch rooms
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
  
  useEffect(() => {
    if (token) fetchRooms();
  }, [token]);
  useEffect(() => {
  if (modalOpen && modalRef.current) {
    modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}, [modalOpen]);
  // pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const displayedRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  // delete room
  const handleDelete = async (roomId: number) => {
    if (!confirm("Delete this room?")) return;
    try {
      await API.delete(`/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
    } catch {
      alert("Delete failed");
    }
  };

  // open modal
  const openModal = (room?: Room) => {
    if (room) {
      setFormData({
        id: room.id,
        name: room.name,
        type: room.type,
        price: room.price,
        description: room.description,
        image: null,
      });
      setPreviewUrl(
        room.imageUrl
          ? `https://lodgebookingbackend.onrender.com${room.imageUrl}`
          : null
      );
    } else {
      setFormData({ name: "", type: "", price: 0, description: "", image: null });
      setPreviewUrl(null);
    }
    setModalOpen(true);
  };

  // save room
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("price", String(formData.price));
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      if (formData.id) {
        await API.put(`/admin/rooms/${formData.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/admin/rooms", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };
  const handleVacant = async (roomId: number) => {
  try {
    const data = new FormData();
    data.append("status", "vacant");

    await API.put(`/admin/rooms/${roomId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, status: "vacant" } : r
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to set room to vacant");
  }
};



  return (
    <DevOnly>
    <Layout>
      <div className="admin-rooms-page">
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Rooms
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Add Room
          </button>
        </div>

        {/* room list */}
        {displayedRooms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No rooms available.</p>
        ) : (
          <>
            <div className="rooms-grid">
              {displayedRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-200"
                >
                  <RoomCard room={room} />
                  <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => openModal(room)}
                        className="flex-1 flex room-action-btn items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleVacant(room.id)}
                        className="flex-1 room-action-btn flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                        disabled={room.status === "vacant"}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Set to Vacant</span>
                      </button>

                      <button
                        onClick={() => handleDelete(room.id)}
                        className="flex-1 room-action-btn flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                        <span>Delete</span>
                      </button>


                          {room.status === "cancelled" && (
                            <span className="ml-2 px-2 py-1 room-action-btn bg-yellow-400 text-black rounded-md text-sm font-semibold">
                              <XCircleIcon className="w-4 h-4" /> Cancelled
                            </span>
                          )}                   
                  </div>

                </div>
              ))}
            </div>

            {/* pagination */}
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

        {/* modal */}
        {modalOpen && (
          <div
            ref={modalRef}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4"
            onClick={() => setModalOpen(false)}
          >
            <div className="flex justify-center items-center min-h-full w-full">
              <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="
                  relative 
                  bg-white dark:bg-gray-800 
                  rounded-none sm:rounded-2xl 
                  p-4 sm:p-6 
                  w-full sm:max-w-xl 
                  max-h-[90vh]    /* ✅ instead of h-screen */
                  shadow-lg 
                  overflow-y-auto 
                  pb-24           /* ✅ extra space for scroll */
                "
              >
                {/* close */}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {formData.id ? "Edit Room" : "Add Room"}
                </h2>

                {/* fields */}
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full mb-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full mb-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full mb-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full mb-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setFormData({ ...formData, image: file });
                    setPreviewUrl(file ? URL.createObjectURL(file) : previewUrl);
                  }}
                  className="mb-3"
                />

                {/* preview */}
                {previewUrl && (
                  <div className="flex justify-center mb-3">
                    <div className="w-44">
                      <RoomCard
                        room={{
                          id: formData.id ?? 0,
                          name: formData.name,
                          type: formData.type,
                          price: formData.price,
                          description: formData.description,
                          imageUrl: previewUrl.replace(
                            "https://lodgebookingbackend.onrender.com",
                            ""
                          ),
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* actions */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-3 pb-3 mt-4 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
    </DevOnly>
  );
}
