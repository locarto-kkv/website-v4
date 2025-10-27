// src/pages/vendor/dashboard/VendorDashboardLayout.jsx
import React, { useState, useEffect } from "react"; // Import useState
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import Sidebar from "../../../components/Sidebar";

const VendorDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // <-- Add state for sidebar visibility

  // Scrolls to the top of the page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close sidebar when navigating or on desktop resize (optional enhancement)
  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  // --- Dynamic Header Logic ---
  const getPageConfig = () => {
    const path = location.pathname;
    // Match more specific paths first
    if (path.endsWith("/orders"))
      return {
        title: "Manage Orders",
        icon: "fas fa-shopping-bag",
        description: "View and manage all customer orders",
      };
    if (path.endsWith("/analytics"))
      return {
        title: "Vendor Analytics",
        icon: "fas fa-chart-bar",
        description: "Comprehensive insights into your business performance",
      };
    if (path.endsWith("/products"))
      return {
        title: "My Products",
        icon: "fas fa-box",
        description: "Manage your product inventory and listings",
      };
    if (path.endsWith("/milestones"))
      return {
        title: "Milestones",
        icon: "fas fa-flag-checkered",
        description: "Track your achievements and progress",
      };
    if (path.endsWith("/members-hub"))
      return {
        title: "Members Hub",
        icon: "fas fa-users",
        description: "Manage your membership and connections",
      };
    if (path.endsWith("/support"))
      return {
        title: "Vendor Support",
        icon: "fas fa-headset",
        description: "Get help and find answers to your questions",
      };
    if (path.endsWith("/profile"))
      return {
        title: "Vendor Profile",
        icon: "fas fa-user-circle",
        description: "Manage your business profile and documentation",
      };
    if (path.endsWith("/settings"))
      return {
        title: "Settings",
        icon: "fas fa-cog",
        description: "Manage your account and business preferences",
      };
    if (path.endsWith("/setup/location"))
      return {
        title: "Set Your Shop Location",
        icon: "fas fa-map-marker-alt",
        description: "Configure your business location",
      };
    if (path.endsWith("/setup"))
      return {
        title: "Vendor Setup Wizard",
        icon: "fas fa-magic",
        description: "Complete your vendor profile setup",
      };
    // Check for exact match for dashboard overview
    if (path === "/vendor/dashboard" || path.endsWith("/overview"))
      return {
        title: "Dashboard Overview",
        icon: "fas fa-chart-line",
        description: "Track your business performance at a glance",
      };

    // Fallback
    return {
      title: "Vendor Portal",
      icon: "fas fa-store",
      description: "Manage your vendor account",
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
      {/* Pass toggleSidebar to Navbar */}
      <DashboardNavbar onMenuClick={toggleSidebar} />
      <div className="flex pt-[70px]">
        {/* Pass state and close function to Sidebar */}
        <Sidebar
          onNavigate={(path) => navigate(path)}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        {/* The main content area is now the scrollable container */}
        {/* Removed fixed height calculation h-[calc(100vh-70px)] */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8"> {/* Standardized padding */}
            {/* Dynamic Page Header */}
            <div className="flex items-center gap-4 mb-8">
              {/* Dynamic Icon */}
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
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
            <Outlet /> {/* Renders the nested route component */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;