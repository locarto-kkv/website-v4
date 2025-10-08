import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  addBlog,
  editBlog,
  deleteBlog,
} from "../../controllers/admin/blog.controller.js";

const router = Router();

router.post("/add", protectRoute("admin"), addBlog);
router.put("/edit/:blogId", protectRoute("admin"), editBlog);
router.delete("/delete/:blogId", protectRoute("admin"), deleteBlog);

export default router;
