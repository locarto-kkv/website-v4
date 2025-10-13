import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService";
import { ConsumerListService } from "../../services/consumer/consumerListService";
import { useAuthStore } from "../../store/useAuthStore.jsx";

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

  useEffect(() => {
    setDataLoading(true);
    const cached = localStorage.getItem("data");

    if (cached) {
      const parsed = JSON.parse(cached);
      setOrders(parsed.order);
      setLists(parsed.list);
      setDataLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const { getOrders } = ConsumerOrderService;
          const { getLists } = ConsumerListService;
          const orderData = await getOrders();
          const listData = await getLists();
          setOrders(orderData);
          setLists(listData);

          localStorage.setItem(
            "data",
            JSON.stringify({
              order: orderData,
              list: listData,
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch Data");
          console.error("Error in ConsumerDataProvider:", error);
        } finally {
          setDataLoading(false);
        }
      };
      if (currentUser?.type === "consumer") fetchData();
    }
  }, [currentUser]);

  return (
    <DataContext.Provider value={{ orders, lists, clearCache, dataLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useConsumerData() {
  return useContext(DataContext);
}
