import DashboardStats from "../../../components/vendor/DashboardStats";
import RecentOrdersTable from "../../../components/vendor/RecentOrdersTable";
import TopSellingProducts from "../../../components/vendor/TopSellingProducts";
import { useVendorData } from "../../../context/vendor/vendorDataContext";

const VendorDashboard = () => {
  const { products, vendor } = useVendorData();

  return (
    // The main layout for the dashboard page.
    // It's a single column by default, stacking components vertically on mobile.
    // On large screens (lg:), it becomes a 3-column grid where the recent orders table takes 2 columns.
    <div className="space-y-4 sm:space-y-6">
      <DashboardStats products={products} vendor={vendor} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable vendor={vendor} />
        </div>

        <div>
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
