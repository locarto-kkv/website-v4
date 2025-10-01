// import { useAnalytic } from "../../context/vendorAnalyticContext";
import BlogPage from "./dashboard/AdminBlogs";

const VendorDashboard = () => {
  // const { products, vendor } = useAnalytic();

  // console.log(products, vendor);

  return (
    <div className="max-w-6xl mx-auto">
      <BlogPage />
    </div>
  );
};

export default VendorDashboard;
