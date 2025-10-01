import { Router } from "express";
import { getBlogs } from "../../controllers/consumer/blog.controller.js";

const router = Router();

router.get("/", getBlogs);

export default router;
