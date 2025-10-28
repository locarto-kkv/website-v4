// src/pages/consumer/consumerRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useConsumerData } from "../../context/consumer/consumerDataContext";

import CustomerDashboardLayout from "./dashboard/CustomerDashboardLayout";

import AuthConsumer from "./authConsumer";
import CustomerOverview from "./dashboard/ConsumerOverview.jsx";
import CustomerOrders from "./dashboard/ConsumerOrders.jsx";
import CustomerLists from "./dashboard/ConsumerLists.jsx";
import CustomerReviews from "./dashboard/ConsumerReview.jsx";
import AddReviewPage from "./dashboard/AddReviewPage.jsx";
import CustomerSupport from "./dashboard/ConsumerSupport.jsx";
import CustomerSettings from "./dashboard/ConsumerSettings.jsx";
import RuleChatbot from "../Chatbot";
import ShopProducts from "./ShopProducts";
import CheckoutPage from "./CheckoutPage";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  const { dataLoading } = useConsumerData();

  if (currentUser?.type !== "consumer") {
    return <Navigate to="/consumer/login" replace />;
  } else {
    if (dataLoading && !["/consumer/checkout"].includes(location.pathname)) {
      return (
        <div className="flex items-center justify-center min-h-screen pt-[70px]">
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
      <Route
        path="login"
        element={
          currentUser?.type === "consumer" ? (
            <Navigate to="/" replace />
          ) : (
            <AuthConsumer />
          )
        }
      />

      {/* --- Protected Routes --- */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard Routes with Layout */}
        <Route path="dashboard" element={<CustomerDashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CustomerOverview />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="lists" element={<CustomerLists />} />
          <Route path="reviews" element={<CustomerReviews />} />
          {/* Keep support and settings within dashboard layout */}
          <Route path="support" element={<CustomerSupport />} />
          <Route path="settings" element={<CustomerSettings />} />
          <Route path="chat" element={<RuleChatbot />} />
        </Route>
        {/* Add Review Route (can be outside or inside dashboard layout depending on preference) */}
        {/* Placing it outside layout for a more focused page feel */}
        <Route path="add-review/:orderId" element={<AddReviewPage />} />
        {/* Other protected consumer routes (outside the dashboard layout) */}
        <Route path="checkout" element={<CheckoutPage />} />{" "}
        {/* <-- Add Checkout Route */}
        <Route
          path="shops/:vendorId/products/:category"
          element={<ShopProducts />}
        />
      </Route>
      {/* --- End Protected Routes --- */}

      {/* Optional Catch-all */}
      {/* <Route path="*" element={<Navigate to="/consumer/dashboard/overview" replace />} /> */}
    </Routes>
  );
};

export default ConsumerRoutes;
