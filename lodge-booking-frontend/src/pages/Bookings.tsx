"use client";
import { useEffect, useState } from "react";
import API from "../api/axios";
import type { Booking } from "../types";
import { useAuth } from "../context/useAuth";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.map(b => (
        <div key={b.id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
          <h3>{b.room.name}</h3>
          <p>From: {b.startDate}</p>
          <p>To: {b.endDate}</p>
          <p>Status: {b.status}</p>
          {b.services.length > 0 && (
            <ul>
              {b.services.map(s => (
                <li key={s.id}>{s.service.name} x{s.quantity}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
