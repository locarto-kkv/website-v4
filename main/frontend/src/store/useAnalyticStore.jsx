import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAnalyticStore = create(
  persist((set, get) => ({
    analyticData: null,
    products: null,
    orders: null,
    dataLoading: false,

    getAnalyticData: async () => {
      set({ dataLoading: true });
      try {
        const response = await axiosInstance.get("/vendor/analytic/");
        set({
          analyticData: response.data,
          products: response.data.products.total,
          orders: response.data.vendors.total,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch Analytics"
        );
        console.log("Error in getAnalyticData:", error);
      } finally {
        set({ dataLoading: false });
      }
    },

    changeDataRange: (range) => {
      console.log("changeDataRange: ", range);

      if (range === "total") {
        set({
          products: get().analyticData.products.total,
          orders: get().analyticData.vendors.total,
        });
      } else if (range === "month") {
        set({
          products: get().analyticData.products.monthly,
          orders: get().analyticData.vendors.monthly,
        });
      } else if (range === "week") {
        set({
          products: get().analyticData.products.weekly,
          orders: get().analyticData.vendors.weekly,
        });
      }
    },
  }))
);
