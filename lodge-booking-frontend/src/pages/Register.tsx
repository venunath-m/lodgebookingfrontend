// pages/Register.tsx
"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PopMessage from "../components/PopMessage";
import Layout from "../components/DashboardLayout"; 
import logo from '../assets/logo.png';
import "./Register.css";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [allowedFeatures, setAllowedFeatures] = useState<string[]>([]);
  const [popMessage, setPopMessage] = useState<string | null>(null);
  const [popType, setPopType] = useState<"success" | "failed" | "info">("info");

  const featuresList = ["Booking", "Services", "Reports","LogOut","Backup & Restore","SignUp"];
  const navigate = useNavigate();
  const { role: loggedInRole } = useAuth();
  const toggleFeature = (feature: string) => {
    setAllowedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPopMessage(null);

    try {
      const payload = { email, name, password, role, allowed_features: role === "user" ? allowedFeatures : [] };
      await API.post("/auth/register", payload);
      setPopMessage("Registered successfully!");
      setPopType("success");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        setPopMessage(response?.data?.detail || "Registration failed");
      } else {
        setPopMessage("Registration failed");
      }
      setPopType("failed");
    }
  };

  const handlePopClose = () => {
    setPopMessage(null);
    if (popType === "success") navigate("/login");
  };

  return (
    <Layout>
      {/* Floating background shapes */}
      <div className="shape-circle large"></div>
      <div className="shape-circle medium"></div>
      <div className="shape-circle small"></div>

      {/* Card */}
      <div className="card">
        <img src={logo} alt="Branding Sparrow" className="logo mx-auto" />
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="form flex flex-col gap-4">
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />

          <select value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")} className="input-field">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {loggedInRole === "admin" && role === "user" && (
            <div className="flex flex-col gap-2 mt-2">
              <label>Allowed Features:</label>
              {featuresList.map(f => (
                <label key={f} className="flex items-center gap-2">
                  <input type="checkbox" checked={allowedFeatures.includes(f)} onChange={() => toggleFeature(f)} />
                  {f}
                </label>
              ))}
            </div>
          )}

          <button type="submit">Register</button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      {popMessage && <PopMessage type={popType} message={popMessage} onClose={handlePopClose} />}
    </Layout>
  );
}
