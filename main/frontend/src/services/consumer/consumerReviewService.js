import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/review";

export const ConsumerReviewService = {
  getReviews: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  getReviewsByProduct: async (productId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${productId}`);
    return response.data;
  },

  addReview: async (productId, reviewData) => {
    const response = await axiosInstance.post(
      `${BASE_URL}/add/${productId}`,
      reviewData
    );
    return response.data;
  },

  editReview: async (reviewId, reviewData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/edit/${reviewId}`,
      reviewData
    );
    return response.data;
  },

  removeReview: async (reviewId) => {
    const response = await axiosInstance.delete(
      `${BASE_URL}/delete/${reviewId}`
    );
    return response.data;
  },
};
