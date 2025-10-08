import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService";

const DataContext = createContext();
const CACHE_KEY = "blogs";
const CACHE_TTL = 1000 * 60 * 60;

export function DataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      if (Date.now() - timestamp < CACHE_TTL) {
        setBlogs(data);
        return;
      }
    }

    const fetchData = async () => {
      const { getBlogs } = ConsumerBlogService;
      const data = await getBlogs();
      setBlogs(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ blogs }}>{children}</DataContext.Provider>
  );
}

export function useBlogs() {
  return useContext(DataContext);
}
