import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../../controllers/vendor/profile.controller.js";

const router = Router();

router.get("/", protectRoute("vendor"), getProfile);
router.put("/update", protectRoute("vendor"), updateProfile);
router.delete("/delete", protectRoute("vendor"), deleteProfile);

export default router;
