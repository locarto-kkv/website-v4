import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getBlogs,
  addBlog,
  editBlog,
  deleteBlog,
} from "../../controllers/admin/blog.controller.js";

const router = Router();

router.post("/add", protectRoute("admin"), addBlog);
router.put("/edit/:id", protectRoute("admin"), editBlog);
router.delete("/delete/:id", protectRoute("admin"), deleteBlog);

export default router;
