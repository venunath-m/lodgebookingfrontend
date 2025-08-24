"use client";
import { useState } from "react";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid";
import logo from '../assets/logo.png';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`bg-gray-200 dark:bg-gray-800 w-64 p-4 transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative h-full z-20`}
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Menu</h1>
          <ul className="space-y-3">
            <li><a href="/" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">Home</a></li>
            <li><a href="/bookings" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">Bookings</a></li>
            <li><a href="/rooms" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">Rooms</a></li>
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col ml-0 md:ml-64">
          {/* AppBar */}
          <header className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                <Bars3Icon className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
              <img src={logo} alt="Branding Sparrow" className="logo" />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </header>

          {/* Page content */}
          <main className="p-6 bg-gray-100 dark:bg-gray-950 flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
