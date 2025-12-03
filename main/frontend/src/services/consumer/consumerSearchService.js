import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/search";

export const ConsumerSearchService = {
  getSearchResults: async (query, type = "all") => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { query, type },
    });

    return response.data;
  },

  getSimilarResults: async (query) => {
    const response = await axiosInstance.get(`${BASE_URL}/similar`, {
      params: { query },
    });

    return response.data;
  },
};
