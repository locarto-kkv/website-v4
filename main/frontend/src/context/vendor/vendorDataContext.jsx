import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { VendorOrderService } from "../../services/vendor/vendorOrderService.js";
import { VendorAnalyticService } from "../../services/vendor/vendorAnalyticService.js";
import { VendorProfileService } from "../../services/vendor/vendorProfileService.js";
import { useAuthStore } from "../../store/useAuthStore.jsx";

const DataContext = createContext();

export const VendorDataProvider = ({ children }) => {
  const [analyticData, setAnalyticData] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const { currentUser } = useAuthStore();

  const clearCache = () => {
    localStorage.removeItem("vendor_profile");
    localStorage.removeItem("vendor_analytics");
    localStorage.removeItem("vendor_orders");

    setAnalyticData([]);
    setOrders([]);
    setProducts([]);
    setVendor([]);
    setProfile(null);
  };

  const changeDataRange = (range) => {
    if (!analyticData) return;

    let newProducts, newVendor;
    if (range === "total") {
      newProducts = analyticData.products.total;
      newVendor = analyticData.vendor.total;
    } else if (range === "month") {
      newProducts = analyticData.products.monthly;
      newVendor = analyticData.vendor.monthly?.[0];
    } else if (range === "week") {
      newProducts = analyticData.products.weekly;
      newVendor = analyticData.vendor.weekly?.[0];
    }

    setProducts(newProducts);
    setVendor(newVendor);
  };

  const getProfile = async () => {
    try {
      const response = await VendorProfileService.getProfile();
      localStorage.setItem(
        "vendor_profile",
        JSON.stringify({ data: response, timestamp: Date.now() })
      );
      setProfile(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching profile:", error);
    }
  };

  const getAnalytics = async () => {
    try {
      const response = await VendorAnalyticService.getAnalytics();
      localStorage.setItem(
        "vendor_analytics",
        JSON.stringify({ data: response, timestamp: Date.now() })
      );
      setAnalyticData(response);
      setProducts(response.products?.total);
      setVendor(response.vendor?.total);

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch analytics");
      console.error("Error fetching analytics:", error);
    }
  };

  const getOrders = async () => {
    try {
      const response = await VendorOrderService.getOrders();
      localStorage.setItem(
        "vendor_orders",
        JSON.stringify({ data: response, timestamp: Date.now() })
      );
      setOrders(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", error);
    }
  };

  const loadVendorData = async () => {
    try {
      setDataLoading(true);

      const cachedProfile = localStorage.getItem("vendor_profile");
      const cachedAnalytics = localStorage.getItem("vendor_analytics");
      const cachedOrders = localStorage.getItem("vendor_orders");

      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed.data);
      } else {
        await getProfile();
      }

      if (cachedAnalytics) {
        const parsed = JSON.parse(cachedAnalytics);
        setAnalyticData(parsed.data);
        setProducts(parsed.data.products?.total);
        setVendor(parsed.data.vendor?.total);
      } else {
        await getAnalytics();
      }

      if (cachedOrders) {
        const parsed = JSON.parse(cachedOrders);
        setOrders(parsed.data);
      } else {
        await getOrders();
      }
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.type === "vendor") {
      loadVendorData();
    } else {
      clearCache();
    }
  }, [currentUser]);

  return (
    <DataContext.Provider
      value={{
        analyticData,
        products,
        vendor,
        orders,
        profile,
        dataLoading,
        getAnalytics,
        getOrders,
        getProfile,
        changeDataRange,
        clearCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useVendorData = () => useContext(DataContext);
