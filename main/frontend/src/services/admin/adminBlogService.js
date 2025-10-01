import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/blog";

export const AdminBlogService = {
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

  uploadImage: async (files, imgUploadUrls) => {
    await Promise.all(
      imgUploadUrls.map(async (url, i) => {
        const { uploadUrl, fileType } = url;

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": fileType },
          body: files[i],
        });
      })
    );
  },

  addBlog: async (blogData) => {
    // console.log(blogData.blog_images);

    try {
      if (blogData.blog_images.length > 0) {
        const images_metadata = blogData.blog_images.map((file) => ({
          type: file.type,
          name: file.name,
          size: file.size,
        }));

        blogData = { ...blogData, images_metadata };
      }

      const { data: response } = await axiosInstance.post(
        `${BASE_URL}/add`,
        blogData
      );

      // console.log(response.blog);

      if (response.imgUploadUrls) {
        await AdminBlogService.uploadImage(
          blogData.blog_images,
          response.imgUploadUrls
        );
      }
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Add blog failed");
      console.log("Error in addBlog:", error.response?.data?.message);
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
