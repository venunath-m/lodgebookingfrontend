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
  PresentationChartBarIcon
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}
import "../pages/DashboardLayout.css";
export default function DashboardLayout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="logo-container">
             <div style={{ height: "4.5rem" }}></div>
          </div>
          <ul className="menu">
            <li>
              <NavLink to="/" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <HomeIcon className="icon" /> Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/bookings" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <CalendarIcon className="icon" /> Bookings
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/rooms" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <ClipboardDocumentIcon className="icon" /> Rooms
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/services" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <Cog6ToothIcon className="icon" /> Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/assign-services" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <ArrowPathIcon className="icon" /> Assign Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/reports" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <PresentationChartBarIcon className="icon" /> Reports
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <ClipboardDocumentIcon className="icon" /> Invoices
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices/create" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <DocumentPlusIcon className="icon" /> Create Invoice
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices/reports" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <ArchiveBoxIcon className="icon" /> Invoice Reports
              </NavLink>
            </li>

            <li>
              <NavLink to="/invoices/dashboard" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <PresentationChartBarIcon className="icon" /> Invoices Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/backup-restore" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <ArrowPathIcon className="icon" /> Backup & Restore
              </NavLink>
            </li>

            <li>
              <NavLink to="/logout" className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>
                <ArrowRightOnRectangleIcon className="icon" /> Logout
              </NavLink>
            </li>
          </ul>

        </aside>

        {/* Main Content */}
        <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          {/* AppBar */}
          <header className="appbar">
            <div className="appbar-left">
              <img src={logo} alt="Logo" className="logo" />
            </div>

            {isMobile && (
              <button onClick={toggleSidebar} className="hamburger-btn">
                <Bars3Icon className="icon" />
              </button>
            )}

            <button onClick={() => setDarkMode(!darkMode)} className="theme-btn">
              {darkMode ? <SunIcon className="icon sun" /> : <MoonIcon className="icon moon" />}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </header>




          {/* Page content */}
          <main className="page-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
