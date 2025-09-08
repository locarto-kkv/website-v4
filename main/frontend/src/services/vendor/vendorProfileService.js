import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/vendor/profile";

export const VendorProfileService = {
  getProfile: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(`${BASE_URL}/update`, profileData);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await axiosInstance.delete(`${BASE_URL}/delete`);
    return response.data;
  },

  uploadDocs: async (formData) => {
    const response = await axiosInstance.post(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
