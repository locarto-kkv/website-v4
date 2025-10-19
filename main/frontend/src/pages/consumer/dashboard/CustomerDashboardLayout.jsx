// src/pages/consumer/dashboard/CustomerDashboardLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar"; // Adjust path if needed
import Sidebar from "../../../components/Sidebar"; // Adjust path if needed
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed

const CustomerDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dataLoading } = useConsumerData();

  // Scrolls to the top of the page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Optional: Add loading state
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-[70px]"> {/* Adjusted min-height */}
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Dynamic Header Logic (moved from consumerRoutes) ---
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.endsWith("/orders")) return "My Orders";
    if (path.endsWith("/lists")) return "My Lists";
    if (path.endsWith("/reviews")) return "My Reviews";
    if (path.endsWith("/support")) return "Customer Support";
    if (path.endsWith("/settings")) return "Account Settings";
    // Check for exact match for overview
    if (path === '/consumer/dashboard' || path.endsWith("/overview")) return "Dashboard Overview";
    return "Dashboard"; // Fallback
  };
  const getPageDescription = () => {
     const path = location.pathname;
    if (path.endsWith("/orders")) return "Track and manage all your orders";
    if (path.endsWith("/lists")) return "Manage your cart and wishlist";
    if (path.endsWith("/reviews")) return "Share your feedback";
    if (path.endsWith("/support")) return "Get help and find answers";
    if (path.endsWith("/settings")) return "Manage your account details";
     // Check for exact match for overview
    if (path === '/consumer/dashboard' || path.endsWith("/overview")) return "Welcome back! Here's your overview.";
    return "Manage your account."; // Fallback
  }

  const pageTitle = getPageTitle();
  const pageDescription = getPageDescription();
  // --- End Dynamic Header Logic ---

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar /> {/* Shared Navbar */}
      <div className="flex pt-[70px]">
        {/* Pass navigate function to Sidebar */}
        <Sidebar onNavigate={navigate} /> {/* Shared Sidebar */}
        {/* Main content area */}
        <main className="flex-1 h-[calc(100vh-70px)] overflow-y-auto">
             <div className="p-6 md:p-8"> {/* Standardized padding */}
                {/* Dynamic Page Header */}
                 <div className="mb-8">
                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{pageTitle}</h1> {/* Adjusted margin */}
                   <p className="text-gray-600">{pageDescription}</p>
                 </div>
                <Outlet /> {/* Renders the nested route component */}
             </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;