import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/order";

export const ConsumerOrderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  placeOrder: async (orderData) => {
    const response = await axiosInstance.post(
      `${BASE_URL}/place-order/`,
      orderData
    );
    return response.data;
  },

  cancelOrderItem: async (itemId) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/cancel-order/${itemId}`
    );
    return response.data;
  },
};
