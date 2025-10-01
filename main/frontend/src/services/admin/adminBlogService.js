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

      const { data } = await axiosInstance.post(`${BASE_URL}/add`, blogData);

      // console.log(response.blog);

      if (data.imgUploadUrl) {
        await AdminBlogService.uploadImage(
          blogData.brand_logo,
          data.imgUploadUrl
        );
      }

      toast.success("Blog Added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Add blog failed");
      console.log("Error in addBlog:", error);
    }
  },

  editBlog: async (blogId, blogData) => {
    if (blogData.brand_logo) {
      const brand_logo_metadata = {
        type: blogData.brand_logo.type,
        name: blogData.brand_logo.name,
        size: blogData.brand_logo.size,
      };

      blogData = { ...blogData, brand_logo_metadata };
    }

    const { data } = await axiosInstance.put(`${BASE_URL}/${blogId}`, blogData);

    if (data.imgUploadUrl) {
      await AdminBlogService.uploadImage(
        blogData.brand_logo,
        data.imgUploadUrl
      );
    }

    toast.success("Blog Updated");
  },

  deleteBlog: async (blogId) => {
    await axiosInstance.delete(`${BASE_URL}/${blogId}`);
    toast.success("Blog Deleted");
  },
};
