import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import VendorSidebar from "../../../components/vendor/VendorSidebar";
import { useAnalytic } from "../../../context/vendorAnalyticContext";

const VendorDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { dataLoading } = useAnalytic();

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
      {/* This pt-[70px] class is the crucial fix. It adds 70px of top padding. */}
      <div className="flex pt-[70px]">
        <VendorSidebar onNavigate={(path) => navigate(path)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;