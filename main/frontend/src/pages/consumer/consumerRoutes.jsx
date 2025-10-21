// src/pages/consumer/consumerRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom"; // Removed useNavigate, useLocation, useEffect, React
import { useAuthStore } from "../../store/useAuthStore";
import { useConsumerData } from "../../context/consumer/consumerDataContext";

// Import the new Layout
import CustomerDashboardLayout from "./dashboard/CustomerDashboardLayout";

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
  const { clearCache, dataLoading } = useConsumerData();
  console.log(dataLoading);

  if (currentUser?.type !== "consumer") {
    clearCache();
    return <Navigate to="/consumer/login" replace />;
  } else {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen pt-[70px]">
          {" "}
          {/* Adjusted min-height */}
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading consumer data...</p>
          </div>
        </div>
      );
    }
    return <Outlet />;
  }
};

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
      <Route path="dashboard" element={<ProtectedRoute />}>
        <Route element={<CustomerDashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CustomerOverview />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="lists" element={<CustomerLists />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>
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
