"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";
import API from "../api/axios";
import "./services.css";

interface Room {
  id: number;
  name: string;
  type: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface RoomService {
  serviceId: number;
  name: string;
  price: number;
  quantity?: number;
  startDate?: string;
  startTime?: string;
}

const AssignServices: React.FC = () => {
  const { token } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [assignedServices, setAssignedServices] = useState<RoomService[]>([]);
  const [dateFilter, setDateFilter] = useState<{ from?: string; to?: string }>({});
  const [newServiceId, setNewServiceId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    API.get("/rooms", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRooms(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    API.get("/services", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, [token]);

  const fetchAssignedServices = async (roomId: number) => {
    try {
      const res = await API.get(`/rooms/${roomId}/services`, { headers: { Authorization: `Bearer ${token}` } });
      setAssignedServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setAssignedServices([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedRoom || !newServiceId) return;
    try {
      await API.post(`/admin/rooms/${selectedRoom}/services`, new URLSearchParams({ serviceId: String(newServiceId) }), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssignedServices(selectedRoom);
      setNewServiceId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (serviceId: number) => {
    if (!selectedRoom) return;
    try {
      await API.delete(`/admin/rooms/${selectedRoom}/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssignedServices(selectedRoom);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredServices = assignedServices.filter((svc) => {
    if (dateFilter.from && svc.startDate && svc.startDate < dateFilter.from) return false;
    if (dateFilter.to && svc.startDate && svc.startDate > dateFilter.to) return false;
    return true;
  });

  return (
    <Layout>
      <div className="assign-services">
        <h2>Assign Services to Rooms</h2>

        <div className="form-group">
          <label>Select Room</label>
          <select
            value={selectedRoom ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedRoom(id);
              fetchAssignedServices(id);
            }}
          >
            <option value="">-- Select Room --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} ({room.type})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Filter by Date</label>
          <input
            type="date"
            value={dateFilter.from || ""}
            onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
          />
          <input
            type="date"
            value={dateFilter.to || ""}
            onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
          />
        </div>

        {selectedRoom && (
          <div className="table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((svc) => (
                    <tr key={svc.serviceId}>
                      <td data-label="Service">{svc.name}</td>
                      <td data-label="Price">${svc.price}</td>
                      <td data-label="Quantity">{svc.quantity || 1}</td>
                      <td data-label="Date">{svc.startDate ? new Date(svc.startDate).toLocaleDateString() : "-"}</td>
                      <td data-label="Time">{svc.startTime ? new Date(`1970-01-01T${svc.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</td>
                      <td data-label="Actions">
                        <button onClick={() => handleRemove(svc.serviceId)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No services assigned</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedRoom && (
          <div className="form-group">
            <label>Add Service</label>
            <select
              value={newServiceId ?? ""}
              onChange={(e) => setNewServiceId(Number(e.target.value))}
            >
              <option value="">-- Select Service --</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name} (${svc.price})
                </option>
              ))}
            </select>
            <button onClick={handleAssign}>Add</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignServices;
