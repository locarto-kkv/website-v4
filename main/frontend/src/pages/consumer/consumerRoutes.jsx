// src/pages/consumer/consumerRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; //
import { useConsumerData } from "../../context/consumer/consumerDataContext"; //

// Consumer pages/components
import AuthConsumer from "./authConsumer"; //
// import ConsumerDashboardLayout from "../../components/consumer/ConsumerDashboardLayout"; // Old incorrect path
import ConsumerDashboardLayout from "./consumerDashboard";
import CustomerOverview from "./dashboard/ConsumerOverview.jsx";
import CustomerOrders from "./dashboard/ConsumerOrders.jsx";
import CustomerLists from "./dashboard/ConsumerLists.jsx";
import CustomerReviews from "./dashboard/ConsumerReview.jsx";
import CustomerSupport from "./dashboard/ConsumerSupport.jsx";
import CustomerSettings from "./dashboard/ConsumerSettings.jsx";

import RuleChatbot from "../Chatbot"; //
import ShopProducts from "./ShopProducts"; //

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore(); //
  const { clearCache } = useConsumerData(); //

  if (currentUser?.type !== "consumer") {
    //
    clearCache(); //
    return <Navigate to="/consumer/login" replace />; //
  } else {
    // Wrap the Outlet with the layout component
    return <ConsumerDashboardLayout />; //
  }
};

const ConsumerRoutes = () => {
  const { currentUser } = useAuthStore(); //

  return (
    <Routes>
      {/* Public routes */}
      <Route path="chat" element={<RuleChatbot />} /> //
      <Route
        path="login" //
        element={
          currentUser?.type === "consumer" ? ( //
            // Redirect logged-in users to the overview page
            <Navigate to="/consumer/dashboard/overview" replace /> //
          ) : (
            <AuthConsumer /> //
          )
        }
      />
      {/* --- Protected Dashboard Routes --- */}
      {/* The ProtectedRoute now renders the ConsumerDashboardLayout */}
      <Route path="dashboard" element={<ProtectedRoute />}>
        {" "}
        //
        {/* Index route redirects to overview */}
        <Route index element={<Navigate to="overview" replace />} /> //
        <Route path="overview" element={<CustomerOverview />} /> //
        <Route path="orders" element={<CustomerOrders />} /> //
        <Route path="lists" element={<CustomerLists />} /> //
        <Route path="reviews" element={<CustomerReviews />} /> //
        <Route path="support" element={<CustomerSupport />} /> //
        <Route path="settings" element={<CustomerSettings />} /> //
        {/* Add other nested dashboard routes here */}
      </Route>
      {/* --- End Protected Dashboard Routes --- */}
      {/* Other consumer routes (outside the dashboard layout) */}
      <Route
        path="shops/:vendorId/products/:category" //
        element={<ShopProducts />} //
      />
      {/* Catch-all for unknown /consumer paths (optional) */}
      {/* <Route path="*" element={<Navigate to="/consumer/dashboard/overview" replace />} /> */}
    </Routes>
  );
};

export default ConsumerRoutes; //
