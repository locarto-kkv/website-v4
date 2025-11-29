import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/blog";

export const AdminBlogService = {
  addBlog: async (blogData) => {
    try {
      console.log(blogData.blog_image.file);
      if (blogData.blog_image) {
        var blog_image_file = blogData.blog_image.file;

        const blog_image_metadata = {
          type: blog_image_file.type,
          name: "blog_image",
          size: blog_image_file.size,
        };

        blogData = { ...blogData, blog_image: blog_image_metadata };
      }
      console.log(blogData);

      const { data } = await axiosInstance.post(`${BASE_URL}/add`, blogData);

      if (data.imgUploadUrl) {
        await AdminBlogService.uploadImage(blog_image_file, data.imgUploadUrl);
      }

      toast.success("Blog Added");
      return data.blog;
    } catch (error) {
      toast.error(error.response?.data?.message || "Add blog failed");
      console.log("Error in addBlog:", error);
    }
  },

  editBlog: async (blogId, blogData, imageUpdated) => {
    try {
      let blog_image_file = null;

      if (imageUpdated) {
        if (blogData.blog_image?.file) {
          blog_image_file = blogData.blog_image.file;

          const image_metadata = {
            name: "blog_image",
            type: blog_image_file.type,
            size: blog_image_file.size,
          };

          blogData.blog_image = image_metadata;
        }
      }

      // Send metadata to backend
      const { data: response } = await axiosInstance.put(
        `${BASE_URL}/edit/${blogId}`,
        { blogData, imageUpdated }
      );

      if (response.imgUploadUrl && blog_image_file) {
        await AdminBlogService.uploadImage(
          blog_image_file,
          response.imgUploadUrl
        );
      }

      toast.success("Blog Updated");
      return response.blog;
    } catch (error) {
      toast.error(error.response?.data?.message || "Edit Blog failed");
      console.error("Error in editBlog:", error);
    }
  },

  deleteBlog: async (blogId) => {
    await axiosInstance.delete(`${BASE_URL}/delete/${blogId}`);
    toast.success("Blog Deleted");
  },

  uploadImage: async (file, imgUploadUrl) => {
    await fetch(imgUploadUrl.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": imgUploadUrl.fileType },
      body: file,
    });
  },
};
