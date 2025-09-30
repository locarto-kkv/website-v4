import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAnalyticStore = create(
  persist(
    (set, get) => ({
      analyticData: null,
      products: null,
      vendor: null, // singular = selected vendor data
      orders: null,
      dataLoading: false,

      // fetch analytics
      getAnalyticData: async () => {
        set({ dataLoading: true });
        try {
          const response = await axiosInstance.get("/vendor/analytic/");
          const orders = await axiosInstance.get("/vendor/order");

          set({
            analyticData: response.data,
            products: response.data.products.total,
            vendor: response.data.vendors.total,
            orders: orders.data,
          });
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to fetch Analytics"
          );
          console.error("Error in getAnalyticData:", error);
        } finally {
          set({ dataLoading: false });
        }
      },

      // update state by range
      changeDataRange: (range) => {
        set((state) => {
          let products, vendor;
          if (range === "total") {
            products = state.analyticData.products.total;
            vendor = state.analyticData.vendors.total;
          } else if (range === "month") {
            products = state.analyticData.products.monthly;
            vendor = state.analyticData.vendors.monthly[0];
          } else if (range === "week") {
            products = state.analyticData.products.weekly;
            vendor = state.analyticData.vendors.weekly[0];
          }
          console.log("changeDataRange:", range, vendor);
          return { products, vendor };
        });
      },
    }),
    { name: "analytic-store" } // persist key
  )
);
