import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService.js";
import { ConsumerListService } from "../../services/consumer/consumerListService.js";
import { useAuthStore } from "../../store/useAuthStore";

const DataContext = createContext();

export function ConsumerDataProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [lists, setLists] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { currentUser } = useAuthStore();

  const clearCache = () => {
    localStorage.clear();
    setOrders([]);
    setLists([]);
  };

  const fetchOrders = async () => {
    try {
      const { getOrders } = ConsumerOrderService;
      const orderData = await getOrders();
      setOrders(orderData);

      localStorage.setItem(
        "orders",
        JSON.stringify({
          order: orderData,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error in ConsumerDataProvider:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      const { getLists } = ConsumerListService;
      const listData = await getLists();
      setLists(listData);

      localStorage.setItem(
        "lists",
        JSON.stringify({
          list: listData,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Lists");
      console.error("Error in ConsumerDataProvider:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    setDataLoading(true);
    const cached = localStorage.getItem("data");

    if (cached) {
      const parsed = JSON.parse(cached);
      setOrders(parsed.order);
      setLists(parsed.list);
      setDataLoading(false);
    } else {
      if (currentUser?.type === "consumer") {
        fetchLists();
        fetchOrders();
      }
    }
  }, [currentUser]);

  return (
    <DataContext.Provider
      value={{
        orders,
        lists,
        clearCache,
        fetchLists,
        fetchOrders,
        dataLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useConsumerData() {
  return useContext(DataContext);
}
