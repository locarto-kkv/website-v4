import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService.js";
import { ConsumerListService } from "../../services/consumer/consumerListService.js";
import { useAuthStore } from "../../store/useAuthStore.jsx";

const DataContext = createContext();

export function ConsumerDataProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [lists, setLists] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { currentUser } = useAuthStore();

  const clearCache = () => {
    localStorage.removeItem("consumer_orders");
    localStorage.removeItem("consumer_lists");
    setOrders([]);
    setLists([]);
  };

  const fetchOrders = async () => {
    try {
      const cached = localStorage.getItem("consumer_orders");
      if (cached) {
        const parsed = JSON.parse(cached);
        setOrders(parsed.data);
        return parsed.data;
      }

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
    }
  };

  const fetchLists = async () => {
    try {
      const cached = localStorage.getItem("consumer_lists");
      if (cached) {
        const parsed = JSON.parse(cached);
        setLists(parsed.data);
        return parsed.data;
      }

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
    }
  };

  const loadConsumerData = async () => {
    setDataLoading(true);
    try {
      await Promise.all([fetchOrders(), fetchLists()]);
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
