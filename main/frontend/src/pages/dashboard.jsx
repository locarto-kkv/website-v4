import ConsumerDashboard from "./consumer/consumerDashboard";
import VendorDashboard from "./vendor/vendorDashboard";
import { useAuthStore } from "../store/useAuthStore";

function dashboard() {
  const { currentUser } = useAuthStore();

  return currentUser.type === "vendor" ? (
    <VendorDashboard />
  ) : (
    <ConsumerDashboard />
  );
}

export default dashboard;
