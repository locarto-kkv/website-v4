import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/vendor/orders";

export const VendorOrderService = {
  // GET /api/vendor/orders/
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  // PUT /api/vendor/orders/update-status/:id
  updateOrderStatus: async (orderId, statusData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/update-status/${orderId}`,
      statusData
    );
    return response.data;
  },
};
