import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const AnalyticContext = createContext();

export const AnalyticProvider = ({ children }) => {
  const [analyticData, setAnalyticData] = useState(null);
  const [products, setProducts] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [orders, setOrders] = useState(null);
  const [dataLoading, setDataLoading] = useState(true); // start as true

  const getAnalyticData = useCallback(async () => {
    setDataLoading(true);
    try {
      const response = await axiosInstance.get("/vendor/analytic/");
      const ordersResponse = await axiosInstance.get("/vendor/order");

      setAnalyticData(response.data);
      setProducts(response.data.products.total);
      setVendor(response.data.vendors.total);
      setOrders(ordersResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Analytics");
      console.error("Error in getAnalyticData:", error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // ✅ Automatically fetch analytics when provider mounts
  useEffect(() => {
    getAnalyticData();
  }, [getAnalyticData]);

  const changeDataRange = useCallback(
    (range) => {
      if (!analyticData) return;

      let newProducts, newVendor;

      if (range === "total") {
        newProducts = analyticData.products.total;
        newVendor = analyticData.vendors.total;
      } else if (range === "month") {
        newProducts = analyticData.products.monthly;
        newVendor = analyticData.vendors.monthly[0];
      } else if (range === "week") {
        newProducts = analyticData.products.weekly;
        newVendor = analyticData.vendors.weekly[0];
      }

      setProducts(newProducts);
      setVendor(newVendor);
    },
    [analyticData]
  );

  return (
    <AnalyticContext.Provider
      value={{
        analyticData,
        products,
        vendor,
        orders,
        dataLoading,
        getAnalyticData,
        changeDataRange,
      }}
    >
      {children}
    </AnalyticContext.Provider>
  );
};

export const useAnalytic = () => useContext(AnalyticContext);
