// import { useAnalytic } from "../../context/vendorAnalyticContext";
import BlogForm from "./dashboard/AdminBlogs";

const VendorDashboard = () => {
  // const { products, vendor } = useAnalytic();

  // console.log(products, vendor);

  return (
    <div className="max-w-6xl mx-auto">
      <BlogForm />
    </div>
  );
};

export default VendorDashboard;
