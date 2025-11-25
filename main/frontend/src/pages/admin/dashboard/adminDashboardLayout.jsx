// src/pages/admin/dashboard/adminDashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import Sidebar from "../../../components/Sidebar";

const AdminDashboardLayout = () => {
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

  // --- Functions to control sidebar visibility ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  // --- End functions ---

  return (
    <div className="min-h-screen bg-gray-50">
      {/* The DashboardNavbar receives the 'onMenuClick' prop. */}
      <DashboardNavbar onMenuClick={toggleSidebar} />

      <div className="flex pt-[70px]">
        {/* The Sidebar receives 'isOpen' and 'onClose' props. */}
        <Sidebar
          onNavigate={(path) => navigate(path)}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main content area */}
        {/* Added lg:ml-64 margin to accommodate the fixed sidebar on desktop */}
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;