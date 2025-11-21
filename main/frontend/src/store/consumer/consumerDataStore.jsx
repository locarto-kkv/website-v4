import { create } from "zustand";
import toast from "react-hot-toast";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService.js";
import { ConsumerListService } from "../../services/consumer/consumerListService.js";
import { ConsumerProfileService } from "../../services/consumer/consumerProfileService.js";

export const useConsumerDataStore = create((set, get) => ({
  orders: [],
  lists: [],
  profile: [],
  vendorInCart: null,

  // Loading system
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

  clearConsumerData: () => {
    get().startLoading();
    try {
      ["consumer_profile", "consumer_orders", "consumer_lists"].forEach((key) =>
        localStorage.removeItem(key)
      );
      set({
        orders: [],
        lists: [],
        profile: [],
        vendorInCart: null,
      });
    } finally {
      get().stopLoading();
    }
  },

  fetchProfile: async () => {
    get().startLoading();
    try {
      const response = await ConsumerProfileService.getProfile();
      set({ profile: response });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching consumer profile:", error);
    } finally {
      get().stopLoading();
    }
  },

  fetchOrders: async () => {
    get().startLoading();
    try {
      const response = await ConsumerOrderService.getOrders();
      set({ orders: response });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching consumer orders:", error);
    } finally {
      get().stopLoading();
    }
  },

  fetchLists: async () => {
    get().startLoading();
    try {
      const response = await ConsumerListService.getLists();
      set({
        lists: response,
        vendorInCart: response.cart?.[0]?.vendor_id || null,
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lists");
      console.error("Error fetching consumer lists:", error);
    } finally {
      get().stopLoading();
    }
  },

  loadConsumerData: async () => {
    get().startLoading();
    try {
      // const cachedProfile = get().loadCache("consumer_profile");
      // if (cachedProfile) set({ profile: cachedProfile });
      // else
      await get().fetchProfile();

      // const cachedLists = get().loadCache("consumer_lists");
      // if (cachedLists) set({ lists: cachedLists });
      // else
      await get().fetchLists();

      // const cachedOrders = get().loadCache("consumer_orders");
      // if (cachedOrders) set({ orders: cachedOrders });
      // else
      await get().fetchOrders();
    } catch (error) {
      console.error("Error loading consumer data:", error);
    } finally {
      get().stopLoading();
    }
  },
}));
