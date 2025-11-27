import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/search";

export const AdminSearchService = {
  searchConsumers: async (query) => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { query },
    });

    return response.data;
  },
};
