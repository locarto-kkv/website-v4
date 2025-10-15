import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/review";

export const VendorReviewService = {
  replyToReview: async (reviewId, replyData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/reply/${reviewId}`,
      replyData
    );
    return response.data;
  },
  removeReply: async (reviewId) => {
    const response = await axiosInstance.delete(
      `${BASE_URL}/delete/${reviewId}`
    );
    return response.data;
  },
};
