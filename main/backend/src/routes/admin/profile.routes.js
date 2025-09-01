import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  // uploadDocs,
} from "../../controllers/admin/profile.controller.js";
// import { upload } from "../../lib/upload.js";

const router = Router();

router.get("/", protectRoute, getProfile);
router.delete("/delete", protectRoute, deleteProfile);
router.put("/update", protectRoute, updateProfile);
// router.post(
//   "/upload",
//   protectRoute,
//   upload.fields([{ name: "resume" }, { name: "result" }]),
//   uploadDocs
// );

export default router;
