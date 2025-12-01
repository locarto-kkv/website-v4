import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  deleteAddress,
} from "../../controllers/consumer/profile.controller.js";

const router = Router();

router.get("/", protectRoute("consumer"), getProfile);
router.put("/update", protectRoute("consumer"), updateProfile);
router.delete("/delete", protectRoute("consumer"), deleteProfile);
router.delete(
  "/delete-address/:addressId",
  protectRoute("consumer"),
  deleteAddress
);

export default router;
