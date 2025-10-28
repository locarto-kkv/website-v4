import { create } from "zustand";
import toast from "react-hot-toast";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";

export const useDataStore = create((set, get) => ({
  blogs: [],
  start: 0,
  dataLoading: true,

  /** --------------------------
   * ✅ Helper: Load cached data
   * -------------------------- */
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

  /** --------------------------
   * ✅ Helper: Set cache data
   * -------------------------- */
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

  /** --------------------------
   * Clear all cached blogs
   * -------------------------- */
  clearBlogs: () => {
    set({ dataLoading: true });
    try {
      localStorage.removeItem("blogs");
      set({ blogs: [] });
    } finally {
      set({ dataLoading: false });
    }
  },

  /** --------------------------
   * Fetch products and merge them with blogs
   * -------------------------- */
  fetchProductsInBatch: async (query = {}) => {
    set({ dataLoading: true });
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
      set({ dataLoading: false });
    }
  },

  /** --------------------------
   * Fetch blogs (and set cache)
   * -------------------------- */
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

  /** --------------------------
   * Load blogs from cache or API
   * -------------------------- */
  loadBlogs: async () => {
    set({ dataLoading: true });
    try {
      // const cachedBlogs = get().loadCache("blogs");
      // if (cachedBlogs) set({ blogs: cachedBlogs });
      // else
      await get().fetchBlogs();
    } catch (error) {
      console.error("Error loading cached blogs:", error);
      await get().fetchBlogs();
    } finally {
      set({ dataLoading: false });
    }
  },
}));
