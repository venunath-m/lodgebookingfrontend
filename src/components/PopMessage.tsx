"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PopMessageProps {
  type?: "success" | "info" | "failed"; // popup type
  message: string; // main message
  buttonText?: string; // optional button text
  onClose: () => void; // callback when button clicked
}

// Colors per type
const typeColors: Record<string, string> = {
  success: "#28a745",
  info: "#667eea",
  failed: "#dc3545",
};

const PopMessage = ({
  type = "info",
  message,
  buttonText = "OK",
  onClose,
}: PopMessageProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 20);
    return () => clearTimeout(timer);
  }, []);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const headerText = type.charAt(0).toUpperCase() + type.slice(1);

  return createPortal(
    <div className={`modal-overlay ${show ? "show" : ""}`}>
      <div
        className={`modal-card ${show ? "show" : ""}`}
        style={{ borderTop: `6px solid ${typeColors[type]}` }}
      >
        <h2 style={{ color: typeColors[type], marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 600 }}>
          {headerText}
        </h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          style={{ backgroundColor: typeColors[type] }}
          className="px-6 py-2 rounded-xl text-white font-semibold hover:brightness-90 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>,
    modalRoot
  );
};


export default PopMessage;
