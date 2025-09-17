// src/pages/VendorDashboard.jsx
import React, { useEffect, useState } from "react";
import { VendorOrderService } from "../../services/vendor/vendorOrderService";
import { VendorProductService } from "../../services/vendor/vendorProductService";
import { useAuthStore } from "../../store/useAuthStore";

// Component imports
import DashboardStats from "../../components/vendor/DashboardStats";
import RecentOrdersTable from "../../components/vendor/RecentOrdersTable";
import TopSellingProducts from "../../components/vendor/TopSellingProducts";
// NOTE: We remove imports for Layout components like Navbar and Sidebar

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const { currentUser } = useAuthStore();
  // Remove this line - it's causing the error:
  // const { getOrders, addProduct } = Service;

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        // Fetch products
        const productService = new VendorProductService();
        const fetchedProducts = await productService.getProducts();
        setProducts(fetchedProducts);

        // Fetch orders
        const orderService = new VendorOrderService();
        const fetchedOrders = await orderService.getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching dashboard ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <DashboardStats products={products} orders={orders} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={orders} />
        </div>
        
        <div>
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;