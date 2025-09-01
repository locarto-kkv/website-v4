import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/order";

export const ConsumerOrderService = {
  // GET /api/consumer/order/
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/get-orders`);
    return response;
  },

  // DELETE /api/consumer/order/cancel/:id
  cancelOrder: async (orderId) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/cancel-order/${orderId}`
    );
    return response.data;
  },
};
