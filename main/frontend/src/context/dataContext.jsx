import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [start, setStart] = useState(0);

  const clearBlogs = () => {
    localStorage.removeItem("blogs");
    setBlogs([]);
  };

  /**
   * Fetch products and merge them with blogs
   * Each blog (vendor) gets a `products` array of their products
   */
  const fetchProductsInBatch = async (query = {}) => {
    try {
      const response = await ConsumerProductService.getProductsByFilter(
        query,
        start
      );
      // setStart((prev) => prev + 10);
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
      console.error("Error fetching products:", error);
    }
  };

  const fetchBlogs = async () => {
    const data = await ConsumerBlogService.getBlogs(0);
    setBlogs(data);
    localStorage.setItem(
      "blogs",
      JSON.stringify({ data, timestamp: Date.now() })
    );
  };

  useEffect(() => {
    const cached = localStorage.getItem("blogs");

    if (cached) {
      const parsed = JSON.parse(cached);
      setBlogs(parsed.data);
      return;
    }
    fetchBlogs();
  }, []);

  return (
    <DataContext.Provider
      value={{
        blogs,
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
