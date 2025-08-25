"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";
import "./services.css";
import API from "../api/axios";

interface Service {
  id: number;
  name: string;
  price: number;
}

const ServicesAdmin: React.FC = () => {
  const { token } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchServices();
  }, [token]);

  const fetchServices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await API.get("/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // backend returns List[ServiceOut]
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      let res;
      if (editId !== null) {
        // PUT /admin/services/{id}
        res = await API.put(`/admin/services/${editId}`, { name, price }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST /admin/services
        res = await API.post("/admin/services", { name, price }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Update frontend state with returned object
      const updatedService: Service = res.data;
      setServices((prev) => {
        if (editId !== null) {
          return prev.map((s) => (s.id === updatedService.id ? updatedService : s));
        } else {
          return [...prev, updatedService];
        }
      });

      setName("");
      setPrice(0);
      setEditId(null);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { detail?: string } } }).response === "object" &&
        (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
      ) {
        alert(`Error: ${(err as { response?: { data?: { detail?: string } } }).response!.data!.detail}`);
      } else {
        console.error("Error saving service:", err);
      }
    }
  };

  const handleEdit = (svc: Service) => {
    setEditId(svc.id);
    setName(svc.name);
    setPrice(svc.price);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    if (!token) return;

    try {
      await API.delete(`/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { detail?: string } } }).response === "object" &&
        (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
      ) {
        alert(`Cannot delete service: ${(err as { response?: { data?: { detail?: string } } }).response!.data!.detail}`);
      } else {
        console.error("Error deleting service:", err);
      }
    }
  };

  return (
    <Layout>
      <div className="services-admin">
        <h2>Services Management</h2>

        <form onSubmit={handleSubmit} className="service-form">
          <input
            type="text"
            placeholder="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="input"
          />
          <button type="submit" className="btn">
            {editId !== null ? "Update Service" : "Add Service"}
          </button>
        </form>

        {loading ? (
          <p>Loading services...</p>
        ) : (
          <table className="services-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((svc) => (
                  <tr key={svc.id}>
                    <td>{svc.name}</td>
                    <td>${svc.price}</td>
                    <td>
                      <button onClick={() => handleEdit(svc)} className="btn edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(svc.id)} className="btn delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No services found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default ServicesAdmin;
