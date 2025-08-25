// pages/Register.tsx
"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PopMessage from "../components/PopMessage";
import CenteredLayout from "../components/CenteredLayout"; 
import logo from '../assets/logo.png';

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
    <CenteredLayout>
      <div className="card w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
        <img src={logo} alt="Branding Sparrow" className="logo mb-6 mx-auto h-16" />
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="form flex flex-col gap-4">
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />

          <select value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")} className="input-field">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {role === "user" && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Allowed Features:</label>
              {featuresList.map(f => (
                <label key={f} className="flex items-center gap-2">
                  <input type="checkbox" checked={allowedFeatures.includes(f)} onChange={() => toggleFeature(f)} className="accent-indigo-600" />
                  {f}
                </label>
              ))}
            </div>
          )}

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md mt-4">
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>

      {popMessage && <PopMessage type={popType} message={popMessage} onClose={handlePopClose} />}
    </CenteredLayout>
  );
}
