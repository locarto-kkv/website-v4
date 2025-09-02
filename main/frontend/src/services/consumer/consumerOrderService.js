import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/order";

export const ConsumerOrderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/get-orders`);
    return response.data;
  },

  placeOrder: async (productId, product, transaction) => {
    const response = await axiosInstance.post(`${BASE_URL}/place-order`, {
      productId,
      product,
      transaction,
    });
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await axiosInstance.patch(
      `${BASE_URL}/cancel-order/${orderId}`
    );
    return response.data;
  },
};
