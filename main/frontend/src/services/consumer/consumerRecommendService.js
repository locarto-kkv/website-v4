import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/recommend";

export const ConsumerRecommendService = {
  getRandom: async (limit) => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { limit },
    });

    return response.data;
  },
};
