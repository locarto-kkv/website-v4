import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useConsumerData } from "../../context/consumer/consumerDataContext";

// Consumer pages/components
import AuthConsumer from "./authConsumer";
// import ConsumerDashboardLayout from "../../components/consumer/ConsumerDashboardLayout";
import ConsumerDashboard from "./consumerDashboard";
// import ConsumerProfile from "../../components/consumer/ConsumerProfile";
// import ConsumerAnalytics from "../../components/consumer/ConsumerAnalytics";
// import ConsumerSettings from "../../components/consumer/ConsumerSettings";
import RuleChatbot from "../Chatbot";
import ShopProducts from "./ShopProducts";

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  const { clearCache } = useConsumerData();

  if (currentUser?.type !== "consumer") {
    clearCache();
    return <Navigate to="/consumer/login" replace />;
  } else {
    return <Outlet />;
  }
};

const ConsumerRoutes = () => {
  const { currentUser } = useAuthStore();

  return (
    <Routes>
      {/* Public route */}
      <Route path="chat" element={<RuleChatbot />} />
      <Route
        path="login"
        element={
          currentUser?.type === "consumer" ? (
            <Navigate to="/consumer/dashboard" replace />
          ) : (
            <AuthConsumer />
          )
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ConsumerDashboard />}>
          <Route index element={<ConsumerDashboard />} />
          <Route path="dashboard" element={<ConsumerDashboard />} />
          {/* <Route path="profile" element={<ConsumerProfile />} />
          <Route path="analytics" element={<ConsumerAnalytics />} />
          <Route path="settings" element={<ConsumerSettings />} /> */}
        </Route>
      </Route>
      <Route path="shops/:shopId/products" element={<ShopProducts />} />
    </Routes>
  );
};

export default ConsumerRoutes;