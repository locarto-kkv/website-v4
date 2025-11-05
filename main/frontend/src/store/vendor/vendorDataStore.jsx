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
  dataLoading: false,

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
    set({ dataLoading: true });
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
      set({ dataLoading: false });
    }
  },

  changeDataRange: (range) => {
    set({ dataLoading: true });
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
      set({ dataLoading: false });
    }
  },

  fetchProfile: async () => {
    set({ dataLoading: true });
    try {
      const response = await VendorProfileService.getProfile();
      // get().setCache("vendor_profile", response);
      set({ profile: response });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching profile:", error);
    } finally {
      set({ dataLoading: false });
    }
  },

  fetchAnalytics: async () => {
    set({ dataLoading: true });
    try {
      const response = await VendorAnalyticService.getAnalytics();
      // get().setCache("vendor_analytics", response);
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
      set({ dataLoading: false });
    }
  },

  fetchOrders: async () => {
    set({ dataLoading: true });
    try {
      const response = await VendorOrderService.getOrders();
      // get().setCache("vendor_orders", response);
      set({ orders: response });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      set({ dataLoading: false });
    }
  },

  loadVendorData: async () => {
    set({ dataLoading: true });
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
      // } else {
      await get().fetchAnalytics();
      // }

      // const cachedOrders = get().loadCache("vendor_orders");
      // if (cachedOrders) set({ orders: cachedOrders });
      // else
      await get().fetchOrders();
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      set({ dataLoading: false });
    }
  },
}));
