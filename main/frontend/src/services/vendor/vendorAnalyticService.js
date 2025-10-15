import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/analytic";

export const VendorAnalyticService = {
  getAnalytics: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },
};
