import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService.js";
import { ConsumerListService } from "../../services/consumer/consumerListService.js";
import { ConsumerProfileService } from "../../services/consumer/consumerProfileService.js";
import { useAuthStore } from "../../store/useAuthStore.jsx";

const DataContext = createContext();

export function ConsumerDataProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [lists, setLists] = useState([]);
  const [profile, setProfile] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
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
    console.log("CLEARING");
    console.log("CLEARING");
    console.log("CLEARING");
    console.log("CLEARING");
    console.log("CLEARING");
    console.log("CLEARING");

    setDataLoading(true);
    try {
      ["consumer_profile", "consumer_orders", "consumer_lists"].forEach((key) =>
        localStorage.removeItem(key)
      );
      setOrders([]);
      setLists([]);
      setProfile([]);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch Profile
   * -------------------------- */
  const fetchProfile = async () => {
    setDataLoading(true);
    try {
      const response = await ConsumerProfileService.getProfile();
      setProfile(response);
      // setCache("consumer_profile", response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching consumer profile:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch Orders
   * -------------------------- */
  const fetchOrders = async () => {
    setDataLoading(true);
    try {
      const response = await ConsumerOrderService.getOrders();
      setOrders(response);
      // setCache("consumer_orders", response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching consumer orders:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch Lists
   * -------------------------- */
  const fetchLists = async () => {
    setDataLoading(true);
    try {
      const response = await ConsumerListService.getLists();
      setLists(response);
      // setCache("consumer_lists", response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lists");
      console.error("Error fetching consumer lists:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Load all consumer data
   * -------------------------- */
  const loadConsumerData = async () => {
    setDataLoading(true);
    try {
      // const cachedLists = loadCache("consumer_lists");
      // if (cachedLists) setLists(cachedLists);
      // else
      await fetchLists();

      // const cachedOrders = loadCache("consumer_orders");
      // if (cachedOrders) setOrders(cachedOrders);
      // else
      await fetchOrders();

      // const cachedProfile = loadCache("consumer_profile");
      // if (cachedProfile) setProfile(cachedProfile);
      // else
      await fetchProfile();
    } catch (error) {
      console.error("Error loading consumer data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        orders,
        lists,
        dataLoading,
        fetchOrders,
        fetchLists,
        loadConsumerData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useConsumerData() {
  return useContext(DataContext);
}
