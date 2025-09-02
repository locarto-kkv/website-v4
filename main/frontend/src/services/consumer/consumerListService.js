import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/list";

export const ConsumerListService = {
  getList: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateList: async (type, quantity, productId) => {
    const response = await axiosInstance.patch(`${BASE_URL}/${productId}`, {
      type,
      quantity,
    });
    return response.data;
  },

  removeFromList: async (type, productId) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${productId}`, {
      params: { type },
    });
    return response.data;
  },
};
