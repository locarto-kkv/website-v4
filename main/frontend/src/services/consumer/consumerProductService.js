import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/product";

export const ConsumerProductService = {
  getProductsByFilter: async (filters = {}, start = 0) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/`, {
        params: {
          start,
          filters: JSON.stringify(filters),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
      throw error;
    }
  },
};
