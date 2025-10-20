// src/pages/vendor/vendorRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useVendorData } from "../../context/vendor/vendorDataContext";

import AuthVendor from "./authVendor";
import VendorDashboardLayout from "./dashboard/VendorDashboardLayout";
import VendorDashboard from "./vendorDashboard";
import VendorProfile from "./dashboard/VendorProfile";
import VendorAnalytics from "./dashboard/VendorAnalytics";
import VendorSettings from "./dashboard/VendorSettings";
import VendorProducts from "./dashboard/VendorProducts";
import VendorSupport from "./dashboard/VendorSupport";
import VendorSetup from "./dashboard/VendorSetupWizard";
import VendorsMemberHub from "./dashboard/VendorsMemberHub";
import VendorLocationSetup from "./dashboard/VendorLocationSetup";
import VendorOrders from "./dashboard/VendorOrders"; // Import the new component

const ProtectedRoute = () => {
  // ... (ProtectedRoute remains the same)
  const { currentUser } = useAuthStore();
  const { clearCache } = useVendorData();

  if (currentUser?.type !== "vendor") {
    clearCache();
    return <Navigate to="/vendor/login" replace />;
  } else {
    return <Outlet />;
  }
};

const VendorRoutes = () => {
  const { currentUser } = useAuthStore();

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="login"
        element={
          currentUser?.type === "vendor" ? (
            <Navigate to="/vendor/dashboard" replace />
          ) : (
            <AuthVendor />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<VendorDashboardLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="orders" element={<VendorOrders />} /> {/* Add the new route */}
          <Route path="products" element={<VendorProducts />} />
          <Route path="members-hub" element={<VendorsMemberHub />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="support" element={<VendorSupport />} />
          <Route path="setup" element={<VendorSetup />} />
          <Route path="setup/location" element={<VendorLocationSetup />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default VendorRoutes;