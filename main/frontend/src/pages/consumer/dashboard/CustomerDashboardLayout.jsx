// src/pages/consumer/dashboard/CustomerDashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar"; // Adjust path if needed
import Sidebar from "../../../components/Sidebar"; // Adjust path if needed
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed

const CustomerDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility on mobile

  // Scrolls to the top of the page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Effect to close the sidebar on route changes or when resizing to a desktop view
  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on any navigation

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Tailwind's lg breakpoint
        setIsSidebarOpen(false); // Ensure sidebar is closed on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  // --- Dynamic Header Logic ---
  // Returns an object containing title, description, and icon class based on the current URL
  const getPageConfig = () => {
    const path = location.pathname;
    // Match more specific paths first
    if (path.endsWith("/orders"))
      return {
        title: "My Orders",
        icon: "fas fa-box",
        description: "Track and manage all your orders",
      };
    if (path.endsWith("/lists"))
      return {
        title: "My Lists",
        icon: "fas fa-list",
        description: "Manage your cart and wishlist",
      };
    if (path.endsWith("/reviews"))
      return {
        title: "My Reviews",
        icon: "fas fa-star",
        description: "Share your feedback",
      };
    if (path.endsWith("/support"))
      return {
        title: "Customer Support",
        icon: "fas fa-headset",
        description: "Get help and find answers",
      };
    if (path.endsWith("/settings"))
      return {
        title: "Account Settings",
        icon: "fas fa-cog",
        description: "Manage your account details",
      };
    // Check for exact match for overview
    if (path === "/consumer/dashboard" || path.endsWith("/overview"))
      return {
        title: "Dashboard Overview",
        icon: "fas fa-home",
        description: "Welcome back! Here's your overview.",
      };

    // Fallback
    return {
      title: "Dashboard",
      icon: "fas fa-user",
      description: "Manage your account.",
    };
  };

  const {
    title: pageTitle,
    icon: pageIcon,
    description: pageDescription,
  } = getPageConfig();
  // --- End Dynamic Header Logic ---

  // --- Functions to control sidebar visibility ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  // --- End functions ---

  return (
    <div className="min-h-screen bg-gray-50">
      {/* The DashboardNavbar receives the 'onMenuClick' prop.
        This function will be called by the hamburger icon on mobile to toggle the sidebar.
        This does not affect the desktop UI as the hamburger icon is hidden on larger screens.
      */}
      <DashboardNavbar onMenuClick={toggleSidebar} />

      <div className="flex pt-[70px]">
        {/* The Sidebar receives 'isOpen' and 'onClose' props.
          - 'isOpen' determines if the sidebar should be visible on mobile.
          - 'onClose' allows the sidebar to close itself (e.g., when an item is clicked or the overlay is touched).
          The responsive logic inside the Sidebar component ensures it is always visible and static on desktop (lg screens and up),
          so these props only affect the mobile/tablet view.
        */}
        <Sidebar
          onNavigate={navigate}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main content area */}
        {/* Removed fixed height calculation h-[calc(100vh-70px)] */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Dynamic Page Header */}
            <div className="flex items-center gap-4 mb-8">
              {/* Dynamic Icon */}
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <i className={`${pageIcon} text-white text-xl`}></i>
              </div>
              {/* Dynamic Title and Description */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {pageTitle}
                </h1>
                <p className="text-gray-600 mt-1">{pageDescription}</p>
              </div>
            </div>
            {/* Renders the nested route component (e.g., ConsumerOverview, ConsumerOrders) */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;