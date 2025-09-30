// src/pages/VendorDashboard.jsx
import React, { useEffect, useState } from "react";
import { VendorOrderService } from "../../services/vendor/vendorOrderService.js";
import { VendorProductService } from "../../services/vendor/vendorProductService.js";
import { useAuthStore } from "../../store/useAuthStore";
import { useAnalyticStore } from "../../store/useAnalyticStore";

// Component imports
// import DashboardStats from "../../components/vendor/DashboardStats";
import RecentOrdersTable from "../../components/vendor/RecentOrdersTable";
import TopSellingProducts from "../../components/vendor/TopSellingProducts";
// NOTE: We remove imports for Layout components like Navbar and Sidebar

const VendorDashboard = () => {
  const { products, orders } = useAnalyticStore();

  console.log(products, orders);

  return (
    <div className="max-w-6xl mx-auto">
      <DashboardStats products={products} orders={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          {/* <RecentOrdersTable orders={orders} /> */}
        </div>

        <div>
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
