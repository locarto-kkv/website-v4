// src/pages/vendor/vendorRoutes.jsx

import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
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
import NotFoundPage from "../NotFoundPage";

const ProtectedRoute = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const profile = useVendorDataStore((s) => s.profile);
  const location = useLocation();

  if (currentUser?.type !== "vendor") {
    return <Navigate to="/vendor/login" replace />;
  }

  const isAccessibleRoute =
    location.pathname.includes("profile") ||
    location.pathname.includes("setup") ||
    location.pathname.includes("support");

  // If TOS is accepted, proceed with existing profile/verification check
  if (!profile?.status || profile?.status === "verified" || isAccessibleRoute) {
    return <Outlet />;
  }

  return <Navigate to="/vendor/dashboard/profile" replace />;
};

const VendorRoutes = () => {
  const currentUser = useAuthStore((s) => s.currentUser);

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
          <Route path="milestones" element={<VendorMilestones />} />
          <Route path="members-hub" element={<VendorsMemberHub />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="profile/edit" element={<VendorEditProfile />} />
          <Route
            path="profile/edit/location"
            element={<VendorLocationSetup />}
          />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="support" element={<VendorSupport />} />
          <Route path="setup" element={<VendorSetup />} />
          <Route path="setup/location" element={<VendorLocationSetup />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default VendorRoutes;
