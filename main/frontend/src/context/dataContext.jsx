import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [start, setStart] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  /** --------------------------
   * ✅ Helper: Load cached data
   * -------------------------- */
  const loadCache = (name) => {
    try {
      const cached = localStorage.getItem(name);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return parsed?.data || null;
    } catch (error) {
      console.error(`Error loading cache for ${name}:`, error);
      return null;
    }
  };

  /** --------------------------
   * ✅ Helper: Set cache data
   * -------------------------- */
  const setCache = (name, data) => {
    try {
      localStorage.setItem(
        name,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error(`Error setting cache for ${name}:`, error);
    }
  };

  /** --------------------------
   * Clear all cached blogs
   * -------------------------- */
  const clearBlogs = () => {
    setDataLoading(true);
    try {
      localStorage.removeItem("blogs");
      setBlogs([]);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch products and merge them with blogs
   * -------------------------- */
  const fetchProductsInBatch = async (query = {}) => {
    setDataLoading(true);
    try {
      const response = await ConsumerProductService.getProductsByFilter(
        query,
        start
      );

      // Merge products with blogs by vendor_id
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => {
          const vendorProducts = response.filter(
            (product) => product.vendor_id === blog.id
          );
          return {
            ...blog,
            products: vendorProducts,
          };
        })
      );
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Fetch blogs (and set cache)
   * -------------------------- */
  const fetchBlogs = async () => {
    setDataLoading(true);
    try {
      const data = await ConsumerBlogService.getBlogs(0);
      setBlogs(data);
      // setCache("blogs", data);
    } catch (error) {
      toast.error("Failed to fetch blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Load blogs from cache or API
   * -------------------------- */
  const loadBlogs = async () => {
    setDataLoading(true);
    try {
      // const cachedBlogs = loadCache("blogs");
      // if (cachedBlogs) setBlogs(cachedBlogs);
      // else
      await fetchBlogs();
    } catch (error) {
      console.error("Error loading cached blogs:", error);
      await fetchBlogs();
    } finally {
      setDataLoading(false);
    }
  };

  /** --------------------------
   * Effect: Load blogs on mount
   * -------------------------- */
  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <DataContext.Provider
      value={{
        blogs,
        dataLoading,
        fetchBlogs,
        fetchProductsInBatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
