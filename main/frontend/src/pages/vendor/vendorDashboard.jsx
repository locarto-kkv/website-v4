import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { VendorOrderService } from "../../services/vendor/vendorOrderService";
import { VendorProductService } from "../../services/vendor/vendorProductService";
import { useAuthStore } from "../../store/useAuthStore";

// Component imports
import DashboardStats from "../../components/vendor/DashboardStats";
import RecentOrdersTable from "../../components/vendor/RecentOrdersTable";
import AddProductForm from "../../components/vendor/AddProductForm";
import TopSellingProducts from "../../components/vendor/TopSellingProducts";
// NOTE: We remove imports for Layout components like Navbar and Sidebar

const VendorDashboard = () => {
  const { showAddProduct } = useOutletContext(); // Get state from layout
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const { currentUser } = useAuthStore();
  const { getOrders, addProduct } = VendorProductService;

  useEffect(() => {
    // ... data fetching logic ...
  }, []);

  const handleAddProduct = async (newProduct) => {
    // ... handle product logic ...
  };

  return (
    <div className="max-w-6xl mx-auto">
      <DashboardStats products={products} orders={orders} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={orders} />
        </div>
        <div>
          {showAddProduct && <AddProductForm onSubmit={handleAddProduct} />}
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;