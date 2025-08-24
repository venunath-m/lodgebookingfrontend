"use client";
import { useEffect, useState } from "react";
import API from "../api/axios";
import type { Room } from "../types";
import { useAuth } from "../context/useAuth";
import RoomCard from "../components/RoomCard";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { token } = useAuth();

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
    fetchRooms();
  }, [token]);

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

  return (
    <div>
      <h1>Admin Rooms</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {rooms.map(room => (
          <div key={room.id}>
            <RoomCard room={room} />
            <button onClick={() => handleDelete(room.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
