// src/pages/consumer/consumerRoutes.jsx
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom"; // Added useNavigate, useLocation
import React, { useEffect } from "react"; // Added useEffect, React
import { useAuthStore } from "../../store/useAuthStore";
import { useConsumerData } from "../../context/consumer/consumerDataContext";

// Import Shared Components
import DashboardNavbar from "../../components/DashboardNavbar"; // Import the shared Navbar
import Sidebar from "../../components/Sidebar"; // Import the shared Sidebar

// Consumer pages/components
import AuthConsumer from "./authConsumer";
// Remove import for old ConsumerDashboardLayout
import CustomerOverview from "./dashboard/ConsumerOverview.jsx";
import CustomerOrders from "./dashboard/ConsumerOrders.jsx";
import CustomerLists from "./dashboard/ConsumerLists.jsx";
import CustomerReviews from "./dashboard/ConsumerReview.jsx";
import CustomerSupport from "./dashboard/ConsumerSupport.jsx";
import CustomerSettings from "./dashboard/ConsumerSettings.jsx";

import RuleChatbot from "../Chatbot";
import ShopProducts from "./ShopProducts";

// --- Updated Protected Route using Shared Layout ---
const ProtectedRoute = () => {
  const { currentUser } = useAuthStore();
  const { clearCache, dataLoading } = useConsumerData(); // Add dataLoading if needed
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change (similar to VendorDashboardLayout)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (currentUser?.type !== "consumer") {
    clearCache();
    return <Navigate to="/consumer/login" replace />;
  }

  // Optional: Add loading state like in VendorDashboardLayout
  if (dataLoading) {
      return (
          <div className="flex items-center justify-center h-screen pt-[70px]">
              <p>Loading your dashboard...</p>
          </div>
      );
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.endsWith("/orders")) return "My Orders";
    if (path.endsWith("/lists")) return "My Lists";
    if (path.endsWith("/reviews")) return "My Reviews";
    if (path.endsWith("/support")) return "Customer Support";
    if (path.endsWith("/settings")) return "Account Settings";
    return "Dashboard Overview"; // Default
  };
  const getPageDescription = () => {
     const path = location.pathname;
    if (path.endsWith("/orders")) return "Track and manage all your orders";
    if (path.endsWith("/lists")) return "Manage your cart and wishlist";
    if (path.endsWith("/reviews")) return "Share your feedback";
    if (path.endsWith("/support")) return "Get help and find answers";
    if (path.endsWith("/settings")) return "Manage your account details";
    return "Welcome back! Here's your overview."; // Default
  }

  const pageTitle = getPageTitle();
  const pageDescription = getPageDescription();


  // Render the shared layout structure
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar /> {/* Shared Navbar */}
      <div className="flex pt-[70px]">
        <Sidebar onNavigate={navigate} /> {/* Shared Sidebar */}
        {/* Main content area */}
        <main className="flex-1 h-[calc(100vh-70px)] overflow-y-auto">
             <div className="p-6 md:p-8"> {/* Added padding */}
                {/* Dynamic Page Header */}
                 <div className="mb-8">
                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
                   <p className="text-gray-600">{pageDescription}</p>
                 </div>
                <Outlet /> {/* Renders the nested route component */}
             </div>
        </main>
      </div>
    </div>
  );
};
// --- End Updated Protected Route ---

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
      {/* Use the updated ProtectedRoute which includes the layout */}
      <Route path="dashboard" element={<ProtectedRoute />}>
        {/* Index route redirects to overview */}
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CustomerOverview />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="lists" element={<CustomerLists />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="settings" element={<CustomerSettings />} />
        {/* Add other nested dashboard routes here if needed */}
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