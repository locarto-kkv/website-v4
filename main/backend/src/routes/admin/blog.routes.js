import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getBlogs,
  addBlog,
  editBlog,
  deleteBlog,
} from "../../controllers/admin/blog.controller.js";

const router = Router();

router.get("/", protectRoute, getBlogs);
router.post("/add", protectRoute, addBlog);
router.put("/:id", protectRoute, editBlog);
router.delete("/:id", protectRoute, deleteBlog);

export default router;
