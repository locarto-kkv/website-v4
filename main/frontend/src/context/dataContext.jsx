import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";
import { ConsumerProductService } from "../services/consumer/consumerProductService.js";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);

  const clearBlogs = () => {
    localStorage.removeItem("blogs");
    setBlogs([]);
  };

  const fetchProductsInBatch = async (query) => {
    const { getProducts, getProductsByCategory, getProductsByVendor } =
      ConsumerProductService;

    if (query.category) {
      const data = await getProductsByCategory();
      setProducts(data);
    } else if (query.vendor_id) {
      const data = await getProductsByVendor(query.vendor_id);
      setProducts(data);
    } else {
      const data = await getProducts(start_index);
      setProducts(data);
    }
  };

  const fetchBlogs = async () => {
    const { getBlogs } = ConsumerBlogService;
    const data = await getBlogs(0);
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
      value={{ blogs, products, fetchBlogs, fetchProductsInBatch, clearBlogs }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
