import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/profile";

export const ConsumerProfileService = {
  getProfile: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(`${BASE_URL}/update`, profileData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await axiosInstance.delete(
      `${BASE_URL}/delete-address/${addressId}`
    );
    return response.data;
  },

  deleteProfile: async () => {
    const response = await axiosInstance.delete(`${BASE_URL}/delete`);
    return response.data;
  },
};
