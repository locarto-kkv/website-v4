import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getBlogs,
  removeBlog,
  editBlog,
} from "../../controllers/admin/blog.controller.js";
// import { upload } from "../../lib/admin/upload.js";

const router = Router();

router.get("/", protectRoute, getBlogs);
// router.post(
//   "/upload",
//   protectRoute,
//   upload.array("blog_images", 10),
//   uploadImages
// );
router.put("/:id", protectRoute, editBlog);
router.delete("/:id", protectRoute, removeBlog);

export default router;
