import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import { VendorOrderService } from "../../services/vendor/vendorOrderService.js";
import { useAuthStore } from "../../store/useAuthStore.jsx";

const DataContext = createContext();

export const VendorDataProvider = ({ children }) => {
  const [analyticData, setAnalyticData] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { currentUser } = useAuthStore();

  const clearCache = () => {
    localStorage.clear();
    setAnalyticData([]);
    setOrders([]);
    setProducts([]);
    setVendor([]);
  };

  const changeDataRange = (range) => {
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
  };

  useEffect(() => {
    console.log("MOUNTED");

    setDataLoading(true);
    const cached = localStorage.getItem("analytic");

    if (cached) {
      const parsed = JSON.parse(cached);
      console.log("CACHE");

      setAnalyticData(parsed.data);
      setProducts(parsed.data.products?.total);
      setVendor(parsed.data.vendor?.total);
      setOrders(parsed.order);
      setDataLoading(false);
    } else {
      const getAnalyticData = async () => {
        try {
          console.log("NOT CACHE");

          const { getOrders } = VendorOrderService;

          const analyticResponse = await axiosInstance.get("/vendor/analytic/");
          const ordersResponse = await getOrders();

          setAnalyticData(analyticResponse.data);
          setProducts(analyticResponse.data.products.total);
          setVendor(analyticResponse.data.vendor.total);
          setOrders(ordersResponse);

          localStorage.setItem(
            "analytic",
            JSON.stringify({
              data: analyticResponse.data,
              order: ordersResponse,
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch Data");
          console.error("Error in VendorDataProvider:", error);
        } finally {
          setDataLoading(false);
        }
      };
      if (currentUser?.type === "vendor") getAnalyticData();
    }
  }, [currentUser]);

  return (
    <DataContext.Provider
      value={{
        analyticData,
        products,
        vendor,
        orders,
        dataLoading,
        changeDataRange,
        clearCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useVendorData = () => useContext(DataContext);
