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

  /** --------------------------
   * ✅ Helper: Load cached data
   * -------------------------- */
  const loadCache = (name) => {
    try {
      const cached = localStorage.getItem(name);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return parsed?.data || null;
    } catch (error) {
      console.error(`Error loading cache for ${name}:`, error);
      return null;
    }
  };

  /** --------------------------
   * ✅ Helper: Set cache data
   * -------------------------- */
  const setCache = (name, data) => {
    try {
      localStorage.setItem(
        name,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error(`Error setting cache for ${name}:`, error);
    }
  };

  /** --------------------------
   * Clear all cache
   * -------------------------- */
  const clearCache = () => {
    setDataLoading(true);
    try {
      ["vendor_profile", "vendor_analytics", "vendor_orders"].forEach((key) =>
        localStorage.removeItem(key)
      );

      setAnalyticData([]);
      setOrders([]);
      setProducts([]);
      setVendor([]);
      setProfile(null);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Change analytics range
   * -------------------------- */
  const changeDataRange = (range) => {
    setDataLoading(true);
    try {
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
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch profile
   * -------------------------- */
  const fetchProfile = async () => {
    setDataLoading(true);
    try {
      const response = await VendorProfileService.getProfile();
      // setCache("vendor_profile", response);
      setProfile(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching profile:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch analytics
   * -------------------------- */
  const fetchAnalytics = async () => {
    setDataLoading(true);
    try {
      const response = await VendorAnalyticService.getAnalytics();
      // setCache("vendor_analytics", response);
      setAnalyticData(response);
      setProducts(response.products?.total);
      setVendor(response.vendor?.total);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch analytics");
      console.error("Error fetching analytics:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch orders
   * -------------------------- */
  const fetchOrders = async () => {
    setDataLoading(true);
    try {
      const response = await VendorOrderService.getOrders();
      // setCache("vendor_orders", response);
      setOrders(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Load vendor data from cache or API
   * -------------------------- */
  const loadVendorData = async () => {
    setDataLoading(true);
    console.log("DATA LOADING");

    try {
      // const cachedProfile = loadCache("vendor_profile");
      // if (cachedProfile) setProfile(cachedProfile);
      // else
      await fetchProfile();

      // const cachedAnalytics = loadCache("vendor_analytics");
      // if (cachedAnalytics) {
      //   setAnalyticData(cachedAnalytics);
      //   setProducts(cachedAnalytics.products?.total);
      //   setVendor(cachedAnalytics.vendor?.total);
      // } else {
      await fetchAnalytics();
      // }

      // const cachedOrders = loadCache("vendor_orders");
      // if (cachedOrders) setOrders(cachedOrders);
      // else
      await fetchOrders();
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      console.log("DATA LOADED");

      setDataLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        analyticData,
        products,
        vendor,
        orders,
        profile,
        dataLoading,
        fetchAnalytics,
        fetchOrders,
        fetchProfile,
        loadVendorData,
        changeDataRange,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useVendorData = () => useContext(DataContext);
