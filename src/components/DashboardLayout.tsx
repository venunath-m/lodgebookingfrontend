"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid";
import logo from "../assets/logo.png";
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentPlusIcon,
  PresentationChartBarIcon,
  UserPlusIcon
} from "@heroicons/react/24/solid";
import { NavLink, useNavigate } from "react-router-dom";
import "./NewFloatingStyles.css";
import "../pages/DashboardLayout.css";
import { useAuth } from "../context/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(true); // dark by default
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { setToken } = useAuth();

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div style={{ height: "4.5rem" }}></div>

          <ul className="menu">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                <HomeIcon className="icon" /> Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/bookings" className={({ isActive }) => isActive ? "active" : ""}>
                <CalendarIcon className="icon" /> Bookings
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/rooms" className={({ isActive }) => isActive ? "active" : ""}>
                <ClipboardDocumentIcon className="icon" /> Rooms
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/services" className={({ isActive }) => isActive ? "active" : ""}>
                <Cog6ToothIcon className="icon" /> Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/assign-services" className={({ isActive }) => isActive ? "active" : ""}>
                <ArrowPathIcon className="icon" /> Assign Services
              </NavLink>
            </li>

            {/* <li>
              <NavLink to=""
              // /reports
               className={({ isActive }) => isActive ? "active" : ""}>
                <PresentationChartBarIcon className="icon" /> Reports
              </NavLink>
            </li> */}

            <li>
              <NavLink to="/invoices" className={({ isActive }) => isActive ? "active" : ""}>
                <ClipboardDocumentIcon className="icon" /> Invoices
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices/create" className={({ isActive }) => isActive ? "active" : ""}>
                <DocumentPlusIcon className="icon" /> Create Invoice
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices/reports" className={({ isActive }) => isActive ? "active" : ""}>
                <ArchiveBoxIcon className="icon" /> Invoice Reports
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                <PresentationChartBarIcon className="icon" /> Invoices Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/backup-restore" className={({ isActive }) => isActive ? "active" : ""}>
                <ArrowPathIcon className="icon" /> Backup & Restore
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={({ isActive }) => isActive ? "active" : ""}>
                <UserPlusIcon className="icon" /> Add User
              </NavLink>
            </li>
            {/* 🧾 Accounting Section */}
            {/* <li>
              <NavLink to="/accounting" className={({ isActive }) => isActive ? "active" : ""}>
                <PresentationChartBarIcon className="icon" /> Accounting Dashboard
              </NavLink>
            </li> */}

            <li>
              <NavLink to="/accounting/yearend" className={({ isActive }) => isActive ? "active" : ""}>
                <ArchiveBoxIcon className="icon" /> Year-End Process
              </NavLink>
            </li>
            <li>
              <NavLink to="#" onClick={handleLogout}>
                <ArrowRightOnRectangleIcon className="icon" /> Logout
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          {/* Floating shapes */}
          <div className="shape-circle large"></div>
          <div className="shape-circle medium"></div>
          <div className="shape-circle small"></div>

          {/* AppBar */}
          <header className="appbar">
            <div className="appbar-left">
              <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
              </div>

              {/* Hamburger button outside logo container */}
              {isMobile && (
                <button onClick={toggleSidebar} className="hamburger-btn">
                  <Bars3Icon className="icon" />
                </button>
              )}
            </div>

            <button onClick={toggleDarkMode} className="theme-btn">
              {darkMode ? <SunIcon className="icon sun" /> : <MoonIcon className="icon moon" />}
            </button>
          </header>


          {/* Page content */}
          <main className="page-content">
            <div className="section-gradient card-floating highlight-glow">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
