import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../../controllers/consumer/profile.controller.js";

const router = Router();

router.get("/", protectRoute("consumer"), getProfile);
router.put("/update", protectRoute("consumer"), updateProfile);
router.delete("/delete", protectRoute("consumer"), deleteProfile);

export default router;
