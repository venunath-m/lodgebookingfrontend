// App.tsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AdminRooms from "./pages/AdminRooms";
import ServicesAdmin from "./pages/AdminServicesPage";
import AssignServices from "./pages/RoomServicePage";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceList from "./pages/InvoiceList";
import InvoiceReports from "./pages/InvoiceReports";
import InvoiceDashboard from "./pages/InvoiceDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/admin/rooms" element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><ServicesAdmin /></ProtectedRoute>} />
        <Route path="/admin/assign-services" element={<ProtectedRoute><AssignServices /></ProtectedRoute>} />

        {/* Invoice routes */}
        <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
        <Route path="/invoices/create" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />        
        <Route path="/invoices/reports" element={<ProtectedRoute><InvoiceReports /></ProtectedRoute>} />
        <Route path="/invoices/dashboard" element={<ProtectedRoute><InvoiceDashboard /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
