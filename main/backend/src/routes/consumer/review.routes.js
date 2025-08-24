import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getReviews,
  addReview,
  deleteReview,
  uploadReviewImages,
  editReview,
} from "../../controllers/consumer/review.controller.js";

const router = Router();

router.get("/:id", getReviews);

export default router;
