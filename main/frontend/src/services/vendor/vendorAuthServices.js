import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/vendor/auth";

export const VendorAuthService = {
  // POST /api/vendor/auth/signup
  signup: async (signupData) => {
    const response = await axiosInstance.post(`${BASE_URL}/signup`, signupData);
    return response.data;
  },

  // POST /api/vendor/auth/login
  login: async (loginData) => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, loginData);
    return response.data;
  },

  // POST /api/vendor/auth/logout
  logout: async () => {
    const response = await axiosInstance.post(`${BASE_URL}/logout`);
    return response.data;
  },

  // GET /api/vendor/auth/check
  checkAuth: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/check`);
    return response.data;
  },
};
