import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/vendor/reviews";

export const VendorReviewService = {
  // GET /api/vendor/reviews/:id
  getReviews: async (vendorId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${vendorId}`);
    return response.data;
  },

  // PUT /api/vendor/reviews/reply/:id
  replyToReview: async (reviewId, replyData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/reply/${reviewId}`,
      replyData
    );
    return response.data;
  },
};
