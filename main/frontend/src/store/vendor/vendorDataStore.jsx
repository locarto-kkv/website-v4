import { create } from "zustand";
import toast from "react-hot-toast";
import { VendorOrderService } from "../../services/vendor/vendorOrderService.js";
import { VendorAnalyticService } from "../../services/vendor/vendorAnalyticService.js";
import { VendorProfileService } from "../../services/vendor/vendorProfileService.js";

export const useVendorDataStore = create((set, get) => ({
  analyticData: [],
  products: [],
  vendor: [],
  orders: [],
  profile: [],

  // Loading Manager
  pending: 0,
  dataLoading: false,

  startLoading: () =>
    set((state) => ({
      pending: state.pending + 1,
      dataLoading: true,
    })),

  stopLoading: () =>
    set((state) => {
      const pending = Math.max(0, state.pending - 1);
      return {
        pending,
        dataLoading: pending > 0,
      };
    }),

  loadCache: (name) => {
    try {
      const cached = localStorage.getItem(name);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return parsed?.data || null;
    } catch (error) {
      console.error(`Error loading cache for ${name}:`, error);
      return null;
    }
  },

  setCache: (name, data) => {
    try {
      localStorage.setItem(
        name,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error(`Error setting cache for ${name}:`, error);
    }
  },

  clearVendorData: () => {
    get().startLoading();
    try {
      ["vendor_profile", "vendor_analytics", "vendor_orders"].forEach((key) =>
        localStorage.removeItem(key)
      );
      set({
        analyticData: [],
        orders: [],
        products: [],
        vendor: [],
        profile: [],
      });
    } catch (error) {
      console.error("ERROR in clearVendorData: ", error);
    } finally {
      get().stopLoading();
    }
  },

  changeDataRange: (range) => {
    get().startLoading();
    try {
      const { analyticData } = get();
      if (!analyticData) return;

      let newProducts, newVendor;

      if (range === "total") {
        newProducts = analyticData.products?.total;
        newVendor = analyticData.vendor?.total;
      } else if (range === "month") {
        newProducts = analyticData.products?.monthly;
        newVendor = analyticData.vendor?.monthly?.[0];
      } else if (range === "week") {
        newProducts = analyticData.products?.weekly;
        newVendor = analyticData.vendor?.weekly?.[0];
      }

      set({ products: newProducts, vendor: newVendor });
    } finally {
      get().stopLoading();
    }
  },

  fetchProfile: async () => {
    get().startLoading();
    try {
      const response = await VendorProfileService.getProfile();
      set({ profile: response });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching profile:", error);
    } finally {
      get().stopLoading();
    }
  },

  fetchAnalytics: async () => {
    get().startLoading();
    try {
      const response = await VendorAnalyticService.getAnalytics();
      set({
        analyticData: response,
        products: response.products?.total,
        vendor: response.vendor?.total,
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch analytics");
      console.error("Error fetching analytics:", error);
    } finally {
      get().stopLoading();
    }
  },

  fetchOrders: async () => {
    get().startLoading();
    try {
      const response = await VendorOrderService.getOrders();
      set({ orders: response });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      get().stopLoading();
    }
  },

  loadVendorData: async () => {
    // Batch loading: total pending decrements only when all are done
    get().startLoading();
    try {
      // const cachedProfile = get().loadCache("vendor_profile");
      // if (cachedProfile) set({ profile: cachedProfile });
      // else
      await get().fetchProfile();

      // const cachedAnalytics = get().loadCache("vendor_analytics");
      // if (cachedAnalytics) {
      //   set({
      //     analyticData: cachedAnalytics,
      //     products: cachedAnalytics.products?.total,
      //     vendor: cachedAnalytics.vendor?.total,
      //   });
      // } else
      await get().fetchAnalytics();

      // const cachedOrders = get().loadCache("vendor_orders");
      // if (cachedOrders) set({ orders: cachedOrders });
      // else
      await get().fetchOrders();
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      get().stopLoading();
    }
  },
}));
