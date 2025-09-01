import ConsumerDashboard from "./consumer/consumerDashboard";
import VendorDashboard from "./vendor/vendorDashboard";
import { useAuth } from "../context/authContext";

function dashboard() {
  const { currentUser } = useAuth();

  return currentUser.type === "vendor" ? (
    <VendorDashboard />
  ) : (
    <ConsumerDashboard />
  );
}

export default dashboard;
