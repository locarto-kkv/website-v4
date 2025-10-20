import DashboardStats from "../../components/vendor/DashboardStats";
import RecentOrdersTable from "../../components/vendor/RecentOrdersTable";
import TopSellingProducts from "../../components/vendor/TopSellingProducts";
import { useVendorData } from "../../context/vendor/vendorDataContext";

const VendorDashboard = () => {
  const { products, vendor, dataLoading } = useVendorData();

  // console.log(products, vendor);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <DashboardStats products={products} vendor={vendor} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
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
