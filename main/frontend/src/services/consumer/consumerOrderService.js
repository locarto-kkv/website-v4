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

  cancelOrder: async (orderId) => {
    const response = await axiosInstance.patch(
      `${BASE_URL}/cancel-order/${orderId}`
    );
    return response.data;
  },
};
