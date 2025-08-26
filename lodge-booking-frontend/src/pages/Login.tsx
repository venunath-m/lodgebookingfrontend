"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import PopMessage from "../components/PopMessage";
import CenteredLayout from "../components/CenteredLayout";
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popMessage, setPopMessage] = useState<string | null>(null);
  const [popType, setPopType] = useState<"success" | "failed" | "info">("info");
  const { setToken ,setRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPopMessage(null);

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await API.post("/auth/login", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setToken(res.data.access_token);
      setRole(res.data.role);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      setPopMessage("Login successful!");
      setPopType("success"); // mark as success
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setPopMessage(
          (err.response.data as { detail?: string })?.detail || "Login failed"
        );
      } else {
        setPopMessage("Login failed");
      }
      setPopType("failed"); // mark as failed
    }
  };

  const handlePopClose = () => {
    setPopMessage(null);
    if (popType === "success") {
      navigate("/"); // only navigate on success
    }
  };

  return (
    <CenteredLayout>
      <div className="card">
        <img src={logo} alt="Branding Sparrow" className="logo" />
        <h2>Welcome Back!</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="links">
          <a href="/forgot-password">Forgot Password?</a>          
        </div>      
      </div>

      {popMessage && (
        <PopMessage
          type={popType}      // pass the type
          message={popMessage} 
          onClose={handlePopClose} 
        />
      )}
    </CenteredLayout>
  );
}
