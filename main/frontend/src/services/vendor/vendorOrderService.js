import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/order";

export const VendorOrderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateOrderStatus: async (orderId, order_status) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/update-status/${orderId}`,
      order_status
    );
    return response.data;
  },
};
