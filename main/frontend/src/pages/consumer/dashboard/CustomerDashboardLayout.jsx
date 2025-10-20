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

  // --- Dynamic Header Logic ---
  // Returns an object containing title, description, and icon class
  const getPageConfig = () => {
    const path = location.pathname;
    // Match more specific paths first
    if (path.endsWith("/orders")) return { title: "My Orders", icon: "fas fa-box", description: "Track and manage all your orders" };
    if (path.endsWith("/lists")) return { title: "My Lists", icon: "fas fa-list", description: "Manage your cart and wishlist" };
    if (path.endsWith("/reviews")) return { title: "My Reviews", icon: "fas fa-star", description: "Share your feedback" };
    if (path.endsWith("/support")) return { title: "Customer Support", icon: "fas fa-headset", description: "Get help and find answers" };
    if (path.endsWith("/settings")) return { title: "Account Settings", icon: "fas fa-cog", description: "Manage your account details" };
     // Check for exact match for overview
    if (path === '/consumer/dashboard' || path.endsWith("/overview")) return { title: "Dashboard Overview", icon: "fas fa-home", description: "Welcome back! Here's your overview." };

    // Fallback
    return { title: "Dashboard", icon: "fas fa-user", description: "Manage your account."};
  };


  const { title: pageTitle, icon: pageIcon, description: pageDescription } = getPageConfig();
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
                 {/* **MODIFIED HERE TO INCLUDE ICON** */}
                 <div className="flex items-center gap-4 mb-8">
                     {/* Dynamic Icon */}
                     <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"> {/* Added shadow */}
                       <i className={`${pageIcon} text-white text-xl`}></i>
                     </div>
                     {/* Dynamic Title and Description */}
                     <div>
                       <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pageTitle}</h1> {/* Removed mb-1 */}
                       <p className="text-gray-600 mt-1">{pageDescription}</p> {/* Added mt-1 */}
                     </div>
                 </div>
                 {/* **END MODIFICATION** */}
                <Outlet /> {/* Renders the nested route component */}
             </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;