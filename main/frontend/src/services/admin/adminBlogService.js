import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/blog";

export const AdminBlogService = {
  getBlogs: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  uploadImage: async (file, imgUploadUrl) => {
    await fetch(imgUploadUrl.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": imgUploadUrl.fileType },
      body: file,
    });
  },

  addBlog: async (blogData) => {
    try {
      if (blogData.brand_logo) {
        const brand_logo_metadata = {
          type: blogData.brand_logo.type,
          name: blogData.brand_logo.name,
          size: blogData.brand_logo.size,
        };

        blogData = { ...blogData, brand_logo_metadata };
      }

      const { data: response } = await axiosInstance.post(
        `${BASE_URL}/add`,
        blogData
      );

      // console.log(response.blog);

      if (response.imgUploadUrl) {
        await AdminBlogService.uploadImage(
          blogData.brand_logo,
          response.imgUploadUrl
        );
      }

      toast.success("Blog Added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Add blog failed");
      console.log("Error in addBlog:", error);
    }
  },

  editBlog: async (blogId, blogData) => {
    const response = await axiosInstance.put(`${BASE_URL}/${blogId}`, {
      blogData,
    });
    return response.data;
  },

  removeBlog: async (blogId) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${blogId}`);
    return response.data;
  },
};
