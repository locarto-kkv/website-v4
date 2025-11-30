// src/pages/admin/adminRoutes.jsx
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

import AuthAdmin from "./authAdmin";
import AdminDashboardLayout from "./dashboard/adminDashboardLayout";
import AdminOrders from "./dashboard/AdminOrders";
import AdminBlogs from "./dashboard/AdminBlogs";
import NotFoundPage from "../NotFoundPage";

// ... commented out imports kept for reference
// import AdminProfile from "./dashboard/AdminProfile";
// import AdminAnalytics from "./dashboard/AdminAnalytics";
// import AdminSettings from "./dashboard/AdminSettings";
// import AdminProducts from "./dashboard/AdminProducts";
// import AdminSupport from "./dashboard/AdminSupport";
// import AdminSetup from "./dashboard/AdminSetupWizard";
// import AdminsMemberHub from "./dashboard/AdminsMemberHub";
// import { AnalyticProvider } from "../../context/AdminAnalyticContext";

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  const location = useLocation();

  if (location.pathname === "/admin")
    return <Navigate to="/admin/login" replace />;
  return currentUser?.type === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

const AdminRoutes = () => {
  const { currentUser } = useAuthStore();

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="login"
        element={
          currentUser?.type === "admin" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AuthAdmin />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminDashboardLayout />}>
          {/* Redirect index route of admin to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Dashboard now renders Orders page */}
          <Route path="dashboard" element={<AdminOrders />} />
          
          {/* Legacy orders route redirects to dashboard */}
          <Route path="orders" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Blogs Management Route */}
          <Route path="blogs" element={<AdminBlogs />} />

          {/* Commented out routes for future implementation */}
          {/* <Route path="products" element={<AdminProducts />} />
          <Route path="members-hub" element={<AdminsMemberHub />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="setup" element={<AdminSetup />} /> */}
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;