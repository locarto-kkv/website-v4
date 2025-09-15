import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";

// Public Pages
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/landingpage";
import AuthVendor from "./pages/vendor/authVendor";
// Vendor Pages and Layout
import VendorDashboardLayout from "./components/vendor/VendorDashboardLayout";
import VendorDashboard from "./pages/vendor/vendorDashboard";
import VendorProfile from "./components/vendor/VendorProfile";
import VendorAnalytics from "./components/vendor/VendorAnalytics";
import VendorSettings from "./components/vendor/VendorSettings";

// A component to protect routes
const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  return currentUser ? <Outlet /> : <Navigate to="/vendor/login" replace />;
};

function App() {
  const { currentUser, authLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/vendor/login"
          element={currentUser ? <Navigate to="/vendor/dashboard" /> : <AuthVendor />}
        />

        {/* --- PROTECTED VENDOR ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/vendor" element={<VendorDashboardLayout />}>
            <Route index element={<VendorDashboard />} />
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;