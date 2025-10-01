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
      {/* <DashboardNavbar /> */}
      <div className="flex">
        <VendorSidebar onNavigate={(path) => navigate(path)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;
