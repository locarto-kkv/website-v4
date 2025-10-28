// src/pages/vendor/vendorRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useVendorDataStore } from "../../store/vendor/vendorDataStore";

import AuthVendor from "./authVendor";
import VendorDashboardLayout from "./dashboard/VendorDashboardLayout";
import VendorOverview from "./dashboard/VendorOverview";
import VendorProfile from "./dashboard/VendorProfile";
import VendorAnalytics from "./dashboard/VendorAnalytics";
import VendorSettings from "./dashboard/VendorSettings";
import VendorProducts from "./dashboard/VendorProducts";
import VendorSupport from "./dashboard/VendorSupport";
import VendorSetup from "./dashboard/VendorSetupWizard";
import VendorsMemberHub from "./dashboard/VendorsMemberHub";
import VendorLocationSetup from "./dashboard/VendorLocationSetup";
import VendorOrders from "./dashboard/VendorOrders";
import VendorMilestones from "./dashboard/VendorMilestones";
import VendorEditProfile from "./dashboard/VendorEditProfile";

const ProtectedRoute = () => {
  const { dataLoading } = useVendorDataStore();
  const { currentUser } = useAuthStore();

  if (currentUser?.type !== "vendor") {
    return <Navigate to="/vendor/login" replace />;
  } else {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen pt-[70px]">
          {" "}
          {/* Adjusted min-height */}
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vendor data...</p>
          </div>
        </div>
      );
    }
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
            <Navigate to="/vendor/dashboard/overview" replace />
          ) : (
            <AuthVendor />
          )
        }
      />

      <Route path="dashboard" element={<ProtectedRoute />}>
        <Route element={<VendorDashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<VendorOverview />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="milestones" element={<VendorMilestones />} />{" "}
          {/* <-- ADD THIS ROUTE */}
          <Route path="members-hub" element={<VendorsMemberHub />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="profile/edit" element={<VendorEditProfile />} />{" "}
          {/* <-- Add Edit Profile Route */}
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="support" element={<VendorSupport />} />
          <Route path="setup" element={<VendorSetup />} />
          <Route path="setup/location" element={<VendorLocationSetup />} />
        </Route>
      </Route>
    </Routes>
  ); //
};

export default VendorRoutes;
