import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [start, setStart] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  const clearBlogs = () => {
    setDataLoading(true);
    try {
      localStorage.removeItem("blogs");
      setBlogs([]);
    } finally {
      setDataLoading(false);
    }
  };

  /**
   * Fetch products and merge them with blogs
   * Each blog (vendor) gets a `products` array of their products
   */
  const fetchProductsInBatch = async (query = {}) => {
    setDataLoading(true);
    try {
      const response = await ConsumerProductService.getProductsByFilter(
        query,
        start
      );

      //const batchSize = 10
      //setStart((prev) => prev + batchSize)

      // Merge products with blogs based on vendor_id
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

  const fetchBlogs = async () => {
    setDataLoading(true);
    try {
      const data = await ConsumerBlogService.getBlogs(0);
      setBlogs(data);

      localStorage.setItem(
        "blogs",
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      toast.error("Failed to fetch blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    setDataLoading(true);
    try {
      const cached = localStorage.getItem("blogs");
      if (cached) {
        const parsed = JSON.parse(cached);
        // const cacheAge = Date.now() - parsed.timestamp;
        // const maxAge = 1000 * 60 * 30; // 30 minutes

        // if (cacheAge < maxAge) {
        setBlogs(parsed.data);
        return;
        // } else {
        //   console.log("Cache expired — refetching blogs...");
        // }
      }

      fetchBlogs();
    } catch (error) {
      console.error("Error loading cached blogs:", error);
      fetchBlogs();
    } finally {
      setDataLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        blogs,
        dataLoading,
        fetchBlogs,
        fetchProductsInBatch,
        clearBlogs,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
