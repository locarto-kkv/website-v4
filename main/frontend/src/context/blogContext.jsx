import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService";

const DataContext = createContext();
const CACHE_KEY = "blogs";

export function BlogsProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  const clearBlogs = () => {
    localStorage.removeItem(CACHE_KEY);
    setBlogs([]);
  };

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      setBlogs(parsed.data);
      return;
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
    <DataContext.Provider value={{ blogs, clearBlogs }}>
      {children}
    </DataContext.Provider>
  );
}

export function useBlogs() {
  return useContext(DataContext);
}
