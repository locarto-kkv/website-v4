import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

import AuthVendor from "./authVendor";
import VendorDashboardLayout from "../../components/vendor/VendorDashboardLayout";
import VendorDashboard from "./vendorDashboard";
import VendorProfile from "../../components/vendor/VendorProfile";
import VendorAnalytics from "../../components/vendor/VendorAnalytics";
import VendorSettings from "../../components/vendor/VendorSettings";

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  return currentUser ? <Outlet /> : <Navigate to="/vendor/login" replace />;
};

const VendorRoutes = () => {
  const { currentUser } = useAuthStore();
  console.log(currentUser);

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="login"
        element={
          currentUser ? (
            <Navigate to="/vendor/dashboard" replace />
          ) : (
            <AuthVendor />
          )
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<VendorDashboardLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<VendorSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
