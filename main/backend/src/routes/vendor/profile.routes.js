import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../../controllers/vendor/profile.controller.js";

const router = Router();

router.get("/", protectRoute, getProfile);
router.delete("/delete", protectRoute, deleteProfile);
router.put("/update", protectRoute, updateProfile);

export default router;
