import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/blog";

export const ConsumerBlogService = {
  getBlogs: async (start_index) => {
    const response = await axiosInstance.get(`${BASE_URL}/`, {
      params: { start: start_index },
    });

    return response.data;
  },
};
