import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  replyToReview,
  removeReply,
} from "../../controllers/vendor/review.controller.js";

const router = Router();

router.put("/reply/:reviewId", protectRoute("vendor"), replyToReview);
router.delete("/delete/:reviewId", protectRoute("vendor"), removeReply);

export default router;
