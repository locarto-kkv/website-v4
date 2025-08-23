import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/vendor/transactions";

export const VendorTransactionService = {
  // GET /api/vendor/transactions/
  getTransactions: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },
};
