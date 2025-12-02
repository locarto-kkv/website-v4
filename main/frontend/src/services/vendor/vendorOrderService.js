import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/order";

export const VendorOrderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateOrderStatus: async (itemIds, order_status) => {
    const response = await axiosInstance.put(`${BASE_URL}/update-status/`, {
      itemIds,
      order_status,
    });
    return response.data;
  },
};
