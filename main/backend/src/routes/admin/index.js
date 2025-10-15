import { Router } from "express";

import authRoutes from "./auth.route.js";
import productRoutes from "./product.routes.js";
import blogRoutes from "./blog.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);
router.use("/product", productRoutes);

export default router;
