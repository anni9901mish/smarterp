import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Company from "./pages/Company";
import Ledger from "./pages/Ledger";
import Items from "./pages/Items";
import Purchase from "./pages/Purchase";
import Sales from "./pages/Sales";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import PurchaseHistory from "./pages/PurchaseHistory";
import SalesHistory from "./pages/SalesHistory";
import VoucherDetails from "./pages/VoucherDetails";
import Reports from "./pages/Reports";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="company" element={<Company />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="items" element={<Items />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="sales" element={<Sales />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
          <Route path="sales-history" element={<SalesHistory />} />
          <Route path="voucher/:id" element={<VoucherDetails />} />
          <Route path="reports" element={<Reports />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;