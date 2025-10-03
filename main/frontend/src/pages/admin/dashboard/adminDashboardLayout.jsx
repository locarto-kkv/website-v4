import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import VendorSidebar from "../../../components/vendor/VendorSidebar";
// import { useAnalytic } from "../../../context/vendorAnalyticContext";

const VendorDashboardLayout = () => {
  const navigate = useNavigate();

  // const { dataLoading } = useAnalytic();

  // if (dataLoading) {
  //   return <p>Loading analytics...</p>;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex pt-[70px]">
        <VendorSidebar onNavigate={(path) => navigate(path)} />
        <main className="flex-1 p-6 h-[calc(100vh-70px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;
