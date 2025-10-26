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
  const [dataLoading, setDataLoading] = useState(true);
  const { currentUser } = useAuthStore();

  const clearCache = () => {
    setDataLoading(true);
    try {
      localStorage.removeItem("consumer_profile");
      localStorage.removeItem("consumer_orders");
      localStorage.removeItem("consumer_lists");
      setOrders([]);
      setLists([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchProfile = async () => {
    setDataLoading(true);
    try {
      const response = await ConsumerProfileService.getProfile();
      setProfile(response);

      localStorage.setItem(
        "consumer_profile",
        JSON.stringify({ data: response, timestamp: Date.now() })
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching consumer profile:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchOrders = async () => {
    setDataLoading(true);
    try {
      const response = await ConsumerOrderService.getOrders();
      setOrders(response);

      localStorage.setItem(
        "consumer_orders",
        JSON.stringify({ data: response, timestamp: Date.now() })
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching consumer orders:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchLists = async () => {
    setDataLoading(true);
    try {
      const response = await ConsumerListService.getLists();
      setLists(response);

      localStorage.setItem(
        "consumer_lists",
        JSON.stringify({ data: response, timestamp: Date.now() })
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lists");
      console.error("Error fetching consumer lists:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const loadConsumerData = async () => {
    setDataLoading(true);
    try {
      const cachedLists = localStorage.getItem("consumer_lists");
      if (cachedLists) {
        const parsedLists = JSON.parse(cachedLists);
        setLists(parsedLists.data);
      } else {
        await fetchLists();
      }

      const cachedOrders = localStorage.getItem("consumer_orders");
      if (cachedOrders) {
        const parsedOrders = JSON.parse(cachedOrders);
        setOrders(parsedOrders.data);
      } else {
        await fetchOrders();
      }

      const cachedProfile = localStorage.getItem("consumer_profile");
      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile);
        setProfile(parsedProfile.data);
      } else {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Error loading consumer data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.type === "consumer") {
      loadConsumerData();
    } else {
      clearCache();
      setDataLoading(false);
    }
  }, [currentUser]);

  return (
    <DataContext.Provider
      value={{
        profile,
        orders,
        lists,
        dataLoading,
        fetchOrders,
        fetchLists,
        clearCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useConsumerData() {
  return useContext(DataContext);
}
