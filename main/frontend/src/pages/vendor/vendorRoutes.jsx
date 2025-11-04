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
// --- NEW IMPORT ---
import VendorTOSAcceptance from "./VendorTOSAcceptance";

const ProtectedRoute = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const profile = useVendorDataStore((s) => s.profile);
  const location = useLocation();

  if (currentUser?.type !== "vendor") {
    return <Navigate to="/vendor/login" replace />;
  }

  // --- NEW TOS CHECK ---
  const isTOSPage = location.pathname.includes("/vendor/tos-acceptance");
  
  // If TOS not accepted, redirect to TOS page, unless already on it
  if (currentUser.tosAccepted === false) {
    if (!isTOSPage) {
        return <Navigate to="/vendor/tos-acceptance" replace />;
    }
    return <Outlet />; // Allow access to the TOS page
  }
  // --- END TOS CHECK ---

  const isProfileRoute = location.pathname.includes(
    "/vendor/dashboard/profile"
  );

  // If TOS is accepted, proceed with existing profile/verification check
  if (profile?.status === "verified" || isProfileRoute) {
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
          currentUser?.type === "vendor" && currentUser.tosAccepted ? (
            <Navigate to="/vendor/dashboard/overview" replace />
          ) : (
            <AuthVendor />
          )
        }
      />

      {/* --- NEW TOS ACCEPTANCE ROUTE (outside dashboard layout) --- */}
      <Route path="tos-acceptance" element={<VendorTOSAcceptance />} />

      <Route path="dashboard" element={<ProtectedRoute />}>
        <Route element={<VendorDashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<VendorOverview />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="milestones" element={<VendorMilestones />} />{" "}
          <Route path="members-hub" element={<VendorsMemberHub />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="profile/edit" element={<VendorEditProfile />} />{" "}
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