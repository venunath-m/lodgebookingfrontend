"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";
import API from "../api/axios";
import "./services.css";
import DevOnly from "../context/DevOnly";

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
      const res = await API.get("/services", { headers: { Authorization: `Bearer ${token}` } });
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = editId !== null
        ? await API.put(`/admin/services/${editId}`, { name, price }, { headers: { Authorization: `Bearer ${token}` } })
        : await API.post("/admin/services", { name, price }, { headers: { Authorization: `Bearer ${token}` } });

      const updatedService: Service = res.data;
      setServices((prev) => editId !== null ? prev.map((s) => s.id === updatedService.id ? updatedService : s) : [...prev, updatedService]);

      setName("");
      setPrice(0);
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert("Error saving service");
    }
  };

  const handleEdit = (svc: Service) => {
    setEditId(svc.id);
    setName(svc.name);
    setPrice(svc.price);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    if (!token) return;

    try {
      await API.delete(`/admin/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Cannot delete service");
    }
  };

  return (
    <DevOnly>
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
          <div className="table-wrapper">
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
                      <td data-label="Name">{svc.name}</td>
                      <td data-label="Price">₹{svc.price}</td>
                      <td data-label="Actions">
                        <button onClick={() => handleEdit(svc)} className="edit btn">Edit</button>
                        <button onClick={() => handleDelete(svc.id)} className="delete btn">Delete</button>
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
          </div>
        )}
      </div>
    </Layout>
    </DevOnly>
  );
};

export default ServicesAdmin;
