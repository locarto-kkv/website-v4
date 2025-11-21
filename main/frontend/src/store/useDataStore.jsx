import { create } from "zustand";
import toast from "react-hot-toast";
import { ConsumerBrandService } from "../services/consumer/consumerBrandService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";
import { ConsumerRecommendService } from "../services/consumer/consumerRecommendService.js";
export const useDataStore = create((set, get) => ({
  brands: [],
  recommends: {},
  start: 0,
  dataLoading: false,
  productLoading: false,

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

  clearBrands: () => {
    set({ dataLoading: true });
    try {
      localStorage.removeItem("brands");
      set({ brands: [] });
    } finally {
      set({ dataLoading: false });
    }
  },

  fetchProductsInBatch: async (query = {}) => {
    set({ productLoading: true });
    try {
      const { start, brands } = get();

      const response = await ConsumerProductService.getProductsByFilter(
        query,
        start
      );

      const updatedBrands = brands.map((brand) => {
        const vendorProducts = response.filter(
          (product) => product.vendor_id === brand.id
        );
        return { ...brand, products: vendorProducts };
      });

      set({ brands: updatedBrands });
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      set({ productLoading: false });
    }
  },

  fetchBrands: async () => {
    set({ dataLoading: true });
    try {
      const data = await ConsumerBrandService.getBrands(0);
      set({ brands: data });
      // get().setCache("brands", data);
    } catch (error) {
      toast.error("Failed to fetch brands");
      console.error("Error fetching brands:", error);
    } finally {
      set({ dataLoading: false });
    }
  },

  fetchRecommends: async () => {
    set({ dataLoading: true });
    try {
      const { vendors, products } = await ConsumerRecommendService.getRandom(
        10
      );
      set({ recommends: { vendors, products } });
    } catch (error) {
      toast.error("Failed to fetch brands");
      console.error("Error fetching brands:", error);
    } finally {
      set({ dataLoading: true });
    }
  },

  loadData: async () => {
    set({ dataLoading: true });
    try {
      // const cachedBrands = get().loadCache("brands");
      // if (cachedBrands) set({ brands: cachedBrands });
      // else
      await get().fetchBrands();
      await get().fetchRecommends();
    } catch (error) {
      console.error("Error loading cached brands:", error);
      await get().fetchBrands();
    } finally {
      set({ dataLoading: false });
    }
  },
}));
