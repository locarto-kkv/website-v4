import { create } from "zustand";
import toast from "react-hot-toast";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";
import { ConsumerRecommendService } from "../services/consumer/consumerRecommendService.js";
export const useDataStore = create((set, get) => ({
  blogs: [],
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

  clearBlogs: () => {
    set({ dataLoading: true });
    try {
      localStorage.removeItem("blogs");
      set({ blogs: [] });
    } finally {
      set({ dataLoading: false });
    }
  },

  fetchProductsInBatch: async (query = {}) => {
    set({ productLoading: true });
    try {
      const { start, blogs } = get();

      const response = await ConsumerProductService.getProductsByFilter(
        query,
        start
      );

      const updatedBlogs = blogs.map((blog) => {
        const vendorProducts = response.filter(
          (product) => product.vendor_id === blog.id
        );
        return { ...blog, products: vendorProducts };
      });

      set({ blogs: updatedBlogs });
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      set({ productLoading: false });
    }
  },

  fetchBlogs: async () => {
    set({ dataLoading: true });
    try {
      const data = await ConsumerBlogService.getBlogs(0);
      set({ blogs: data });
      // get().setCache("blogs", data);
    } catch (error) {
      toast.error("Failed to fetch blogs");
      console.error("Error fetching blogs:", error);
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
      toast.error("Failed to fetch blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      set({ dataLoading: true });
    }
  },

  loadData: async () => {
    set({ dataLoading: true });
    try {
      // const cachedBlogs = get().loadCache("blogs");
      // if (cachedBlogs) set({ blogs: cachedBlogs });
      // else
      await get().fetchBlogs();
      await get().fetchRecommends();
    } catch (error) {
      console.error("Error loading cached blogs:", error);
      await get().fetchBlogs();
    } finally {
      set({ dataLoading: false });
    }
  },
}));
