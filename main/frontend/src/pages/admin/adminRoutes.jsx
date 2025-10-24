import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

import AuthAdmin from "./authAdmin";
import AdminDashboardLayout from "./dashboard/AdminDashboardLayout";
import AdminDashboard from "./adminDashboard";
// import AdminProfile from "./dashboard/AdminProfile";
// import AdminAnalytics from "./dashboard/AdminAnalytics";
// import AdminSettings from "./dashboard/AdminSettings";
// import AdminProducts from "./dashboard/AdminProducts";
// import AdminSupport from "./dashboard/AdminSupport";
// import AdminSetup from "./dashboard/AdminSetupWizard";
// import AdminsMemberHub from "./dashboard/AdminsMemberHub"; // Add this import
// import { AnalyticProvider } from "../../context/AdminAnalyticContext";

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();

  return currentUser?.type === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

const AdminRoutes = () => {
  const { currentUser } = useAuthStore();
  // console.log(currentUser);

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
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* <Route path="products" element={<AdminProducts />} />
          <Route path="members-hub" element={<AdminsMemberHub />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="setup" element={<AdminSetup />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
