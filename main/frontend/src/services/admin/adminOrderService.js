import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/order";

export const AdminOrderService = {
  getOrderByFilter: async (filters) => {
    const { data: response } = await axiosInstance.get(`${BASE_URL}/`, {
      filters,
    });
    return response;
  },

  updateOrder: async (orderId, orderData) => {
    const { data: response } = await axiosInstance.put(
      `${BASE_URL}/update-order/${orderId}`,
      orderData
    );

    return response;
  },

  updateOrderItem: async (orderItemId, itemData) => {
    const { data: response } = await axiosInstance.put(
      `${BASE_URL}/update-item/${orderItemId}`,
      itemData
    );

    return response;
  },
};
