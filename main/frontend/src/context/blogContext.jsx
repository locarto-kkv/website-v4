import { createContext, useContext, useState, useEffect } from "react";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { getBlogs } = ConsumerBlogService;
      const data = await getBlogs();
      setBlogs(data);
    };

    fetchData();
  }, []); // FIX: Changed [blogs] to an empty array [] to fetch only once.

  return (
    <DataContext.Provider value={{ blogs }}>{children}</DataContext.Provider>
  );
}

export function useBlogs() {
  return useContext(DataContext);
}