import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

// Consumer pages/components
import AuthConsumer from "./authConsumer";
// import ConsumerDashboardLayout from "../../components/consumer/ConsumerDashboardLayout";
import ConsumerDashboard from "./consumerDashboard";
// import ConsumerProfile from "../../components/consumer/ConsumerProfile";
// import ConsumerAnalytics from "../../components/consumer/ConsumerAnalytics";
// import ConsumerSettings from "../../components/consumer/ConsumerSettings";

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  return currentUser ? <Outlet /> : <Navigate to="/consumer/login" relplace />;
};

const ConsumerRoutes = () => {
  const { currentUser } = useAuthStore();
  // console.log(currentUser);

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="login"
        element={
          currentUser ? (
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
    </Routes>
  );
};

export default ConsumerRoutes;
