import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/order";

export const VendorOrderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/update-status/${orderId}`,
      statusData
    );
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/cancel-status/${orderId}`
    );
    return response.data;
  },
};
