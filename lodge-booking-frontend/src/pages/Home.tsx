"use client";
import { useEffect, useState } from "react";
import API from "../api/axios";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { token } = useAuth();

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
    fetchRooms();
  }, [token]);

  const handleBook = async (roomId: number) => {
    const startDate = prompt("Enter start date (YYYY-MM-DD):");
    const endDate = prompt("Enter end date (YYYY-MM-DD):");
    if (!startDate || !endDate) return;

    try {
      await API.post(
        "/bookings",
        { roomId, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booked successfully!");
    } catch (err: unknown) {
      type AxiosErrorResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

      const error = err as AxiosErrorResponse;

      if (
        typeof err === "object" &&
        err !== null &&
        error.response &&
        typeof error.response === "object" &&
        error.response.data &&
        typeof error.response.data === "object" &&
        error.response.data.detail
      ) {
        alert(error.response.data.detail);
      } else {
        alert("Booking failed");
      }
    }
  };

  return (
    <div>
      <h1>Available Rooms</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} onBook={handleBook} />
        ))}
      </div>
    </div>
  );
}
