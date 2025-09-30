import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

import AuthVendor from "./authVendor";
import VendorDashboardLayout from "./dashboard/VendorDashboardLayout";
import VendorDashboard from "./vendorDashboard";
import VendorProfile from "./dashboard/VendorProfile";
import VendorAnalytics from "./dashboard/VendorAnalytics";
import VendorSettings from "./dashboard/VendorSettings";
import VendorProducts from "./dashboard/VendorProducts";
import VendorSupport from "./dashboard/VendorSupport";
import VendorSetup from "./dashboard/VendorSetupWizard";
import VendorsMemberHub from "./dashboard/VendorsMemberHub"; // Add this import

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  return currentUser ? <Outlet /> : <Navigate to="/vendor/login" replace />;
};

const VendorRoutes = () => {
  const { currentUser } = useAuthStore();
  // console.log(currentUser);

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

      <Route element={<ProtectedRoute />}>
        <Route element={<VendorDashboardLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="members-hub" element={<VendorsMemberHub />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="support" element={<VendorSupport />} />
          <Route path="setup" element={<VendorSetup />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
