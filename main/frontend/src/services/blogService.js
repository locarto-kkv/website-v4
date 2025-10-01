import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/blog";

export const BlogService = {
  getBlogs: async (userId) => {
    const response = userId
      ? await axiosInstance.get(`${BASE_URL}/`)
      : await axiosInstance.get(`${BASE_URL}/`);

    return response.data;
  },

  getBlogById: async (blogId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  },
};
