import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import VendorSidebar from "../../../components/vendor/VendorSidebar";
import { useVendorData } from "../../../context/vendor/vendorDataContext";

const VendorDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { dataLoading } = useVendorData();

  // Scrolls to the top of the page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex pt-[70px]">
        <VendorSidebar onNavigate={(path) => navigate(path)} />
        {/* The main content area is now the scrollable container */}
        <main className="flex-1 p-6 h-[calc(100vh-70px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;
