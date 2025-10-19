// src/pages/consumer/consumerRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom"; // Removed useNavigate, useLocation, useEffect, React
import { useAuthStore } from "../../store/useAuthStore";
import { useConsumerData } from "../../context/consumer/consumerDataContext";

// Import the new Layout
import CustomerDashboardLayout from "./dashboard/CustomerDashboardLayout"; // Adjust path if needed

// Import Shared Components (No longer needed here)
// import DashboardNavbar from "../../components/DashboardNavbar";
// import Sidebar from "../../components/Sidebar";

// Consumer pages/components
import AuthConsumer from "./authConsumer";
import CustomerOverview from "./dashboard/ConsumerOverview.jsx";
import CustomerOrders from "./dashboard/ConsumerOrders.jsx";
import CustomerLists from "./dashboard/ConsumerLists.jsx";
import CustomerReviews from "./dashboard/ConsumerReview.jsx";
import CustomerSupport from "./dashboard/ConsumerSupport.jsx";
import CustomerSettings from "./dashboard/ConsumerSettings.jsx";
import RuleChatbot from "../Chatbot";
import ShopProducts from "./ShopProducts";

// --- Simplified Protected Route ---
const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  const { clearCache } = useConsumerData();

  if (currentUser?.type !== "consumer") {
    clearCache();
    return <Navigate to="/consumer/login" replace />;
  }

  // Render the CustomerDashboardLayout, which handles NavBar, Sidebar, and Outlet
  return <CustomerDashboardLayout />;
};
// --- End Simplified Protected Route ---

const ConsumerRoutes = () => {
  const { currentUser } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="chat" element={<RuleChatbot />} />
      <Route
        path="login"
        element={
          currentUser?.type === "consumer" ? (
            <Navigate to="/consumer/dashboard/overview" replace />
          ) : (
            <AuthConsumer />
          )
        }
      />
      {/* --- Protected Dashboard Routes --- */}
      {/* Use the ProtectedRoute which now renders the CustomerDashboardLayout */}
      <Route path="dashboard" element={<ProtectedRoute />}>
        {/* Index route redirects to overview */}
        <Route index element={<Navigate to="overview" replace />} />
        {/* Nested routes are rendered via the Outlet in CustomerDashboardLayout */}
        <Route path="overview" element={<CustomerOverview />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="lists" element={<CustomerLists />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="settings" element={<CustomerSettings />} />
      </Route>
      {/* --- End Protected Dashboard Routes --- */}

      {/* Other consumer routes (outside the dashboard layout) */}
      <Route
        path="shops/:vendorId/products/:category"
        element={<ShopProducts />}
      />
      {/* Optional Catch-all */}
      {/* <Route path="*" element={<Navigate to="/consumer/dashboard/overview" replace />} /> */}
    </Routes>
  );
};

export default ConsumerRoutes;