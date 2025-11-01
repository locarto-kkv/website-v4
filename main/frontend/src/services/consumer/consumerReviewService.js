import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL = "/consumer/review";

export const ConsumerReviewService = {
  uploadImages: async (files, imgUploadUrls) => {
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

  getReviewsByProduct: async (productId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${productId}`);
    return response.data;
  },

  addReview: async (orderId, reviewData) => {
    try {
      let review_images_files = [];

      const images_metadata = reviewData.review_images.map((image, index) => {
        if (image.file) {
          review_images_files.push(image.file);
          return {
            name: `review_image_${index + 1}`,
            type: image.file.type,
            size: image.file.size,
          };
        } else if (image.url) {
          return {
            name: `review_image_${index + 1}`,
            url: image.url,
          };
        }
      });

      const payload = {
        ...reviewData,
        review_images: {},
      };

      const { data: response } = await axiosInstance.post(
        `${BASE_URL}/add/${orderId}`,
        payload
      );

      if (response.imgUploadUrls && review_images_files.length > 0) {
        await ConsumerReviewService.uploadImages(
          review_images_files,
          response.imgUploadUrls
        );
      }
      toast.success("Review Added");
      return response.review;
    } catch (error) {
      toast.error(error.response?.data?.message || "Add Review failed");
      console.error("Error in addReview:", error);
    }
  },

  editProduct: async (reviewId, reviewData, imagesUpdated) => {
    try {
      console.log(reviewData);

      let review_images_files = [];

      if (imagesUpdated) {
        const images_metadata = reviewData.review_images.map((image, index) => {
          if (image.file) {
            review_images_files.push(image.file);
            return {
              name: `review_image_${index + 1}`,
              type: image.file.type,
              size: image.file.size,
            };
          } else if (image.url) {
            return {
              name: `review_image_${index + 1}`,
              url: image.url,
            };
          }
        });

        reviewData.review_images = images_metadata;
      }

      console.log(reviewData, imagesUpdated);

      const { data: response } = await axiosInstance.put(
        `${BASE_URL}/edit/${reviewId}`,
        { reviewData, imagesUpdated }
      );

      console.log(response);

      if (response.imgUploadUrls && review_images_files.length > 0) {
        await ConsumerReviewService.uploadImages(
          review_images_files,
          response.imgUploadUrls
        );
      }
      toast.success("Review Edited");
      return response.review;
    } catch (error) {
      toast.error(error.response?.data?.message || "Edit Review failed");
      console.error("Error in editReview:", error);
    }
  },

  removeReview: async (reviewId) => {
    const response = await axiosInstance.delete(
      `${BASE_URL}/delete/${reviewId}`
    );
    toast.success("Product Deleted");
    return response.data;
  },
};
