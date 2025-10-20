import { Router } from "express";

import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import blogRoutes from "./blog.routes.js";
import orderRoutes from "./order.routes.js";
import vendorRoutes from "./vendor.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/vendor", vendorRoutes);

export default router;
