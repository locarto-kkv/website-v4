import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/blog";

export const ConsumerBlogService = {
  getBlogs: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },
};
