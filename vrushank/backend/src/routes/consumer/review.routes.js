import { Router } from "express";
import { protectRoute } from "../../middleware/vendor/auth.middleware.js";
import {
  getReviews,
  replyToReview,
} from "../../controllers/vendor/review.controller.js";

const router = Router();

router.get("/:id", getReviews);
router.put("/reply/:id", protectRoute, replyToReview);

export default router;
