import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/order";

export const VendorOrderService = {
  // GET /api/vendor/orders/
  getOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response;
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
