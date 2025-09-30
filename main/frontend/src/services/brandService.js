import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/consumer/";

export const VendorProfileService = {
  getProfile: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },
};
