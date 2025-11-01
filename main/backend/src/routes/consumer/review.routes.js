import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getReviewsByProduct,
  addReview,
  deleteReview,
  editReview,
} from "../../controllers/consumer/review.controller.js";

const router = Router();

router.get("/:productId", getReviewsByProduct);
router.post("/add/:productId", protectRoute("consumer"), addReview);
router.put("/edit/:reviewId", protectRoute("consumer"), editReview);
router.delete("/delete/:reviewId", protectRoute("consumer"), deleteReview);

export default router;
