import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getReviewsByProduct,
  getReviews,
  addReview,
  removeReview,
  editReview,
} from "../../controllers/consumer/review.controller.js";

const router = Router();

router.get("/", protectRoute("consumer"), getReviews);
router.get("/:id", getReviewsByProduct); //id = product.id
router.post("/add/:id", protectRoute("consumer"), addReview); //id = review.id
router.put("/edit/:id", protectRoute("consumer"), editReview); //id = review.id
router.delete("/delete/:id", protectRoute("consumer"), removeReview); //id = review.id

export default router;
