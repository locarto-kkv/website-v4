import ConsumerDashboard from "./consumer/consumerDashboard";
import VendorDashboard from "./vendor/vendorDashboard";
import { useAuth } from "../context/authContext";

function dashboard() {
  const { userType } = useAuth();

  return userType === "vendor" ? <VendorDashboard /> : <ConsumerDashboard />;
}

export default dashboard;
