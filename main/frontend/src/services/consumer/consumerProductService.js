import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/product";

export const ConsumerProductService = {
  getProducts: async (start_index) => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { start_index },
    });

    return response.data;
  },

  getProductsByVendor: async (vendorId, start_index) => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { vendor_id: vendorId, start_index },
    });
    return response.data;
  },

  getProductsByCategory: async (category, start_index) => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { category, start_index },
    });
    return response.data;
  },
};
