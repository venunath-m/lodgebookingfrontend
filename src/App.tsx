// App.tsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { InvoiceProvider } from "./pages/InvoiceContext"; 

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
import DevOnly from "./context/DevOnly";
import AccountingDashboard from "./pages/AccountingDashboard";
import AccountsPage from "./pages/Accounting/AccountsPage";
import JournalEntriesPage from "./pages/Accounting/JournalEntriesPage";
import TrialBalance from "./pages/Accounting/TrialBalance";
import ProfitLoss from "./pages/Accounting/ProfitLoss";
import BalanceSheet from "./pages/Accounting/BalanceSheet";
import YearEndProcess from "./components/accounting/YearEndProcess";
import InvoicePreview from "./pages/InvoicePreview";
import BookingInvoicePreview from "./pages/BookingInvoicePreview";
import CashClosingPage from "./pages/CashClosingPage";

function App() {
  return (
    <AuthProvider>
      {/* ✅ Add InvoiceProvider here */}
      <InvoiceProvider>
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
          <Route path="/cash-closing-report" element={<ProtectedRoute><CashClosingPage /></ProtectedRoute>}/>
          {/* Invoice routes */}
          <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
          <Route path="/invoices/create" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
          <Route path="/invoices/reports" element={<ProtectedRoute><InvoiceReports /></ProtectedRoute>} />
          <Route path="/invoices/dashboard" element={<ProtectedRoute><InvoiceDashboard /></ProtectedRoute>} />
          <Route path="/invoice/preview/:id" element={<InvoicePreview />} />
          <Route path="/invoice-preview" element={<BookingInvoicePreview />} />

          {/* Accounting routes */}
          <Route path="/accounting" element={<ProtectedRoute><AccountingDashboard /></ProtectedRoute>} />
          <Route path="/accounting/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
          <Route path="/accounting/journal-entries" element={<ProtectedRoute><JournalEntriesPage /></ProtectedRoute>} />
          <Route path="/accounting/trial-balance" element={<ProtectedRoute><TrialBalance /></ProtectedRoute>} />
          <Route path="/accounting/profit-loss" element={<ProtectedRoute><ProfitLoss /></ProtectedRoute>} />
          <Route path="/accounting/balance-sheet" element={<ProtectedRoute><BalanceSheet /></ProtectedRoute>} />
          <Route path="/accounting/yearend" element={<ProtectedRoute><YearEndProcess /></ProtectedRoute>} />
        </Routes>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;
