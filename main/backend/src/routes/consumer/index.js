import { Router } from "express";

import authRoutes from "./auth.route.js";
import productRoutes from "./product.routes.js";
import profileRoutes from "./profile.routes.js";
import orderRoutes from "./order.routes.js";
import reviewRoutes from "./review.routes.js";
import listRoutes from "./consumer_list.routes.js";
import blogRoutes from "./blog.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/profile", profileRoutes);
router.use("/order", orderRoutes);
router.use("/review", reviewRoutes);
router.use("/list", listRoutes);
router.use("/blog", blogRoutes);

import { submitBeta } from "../../controllers/beta.controller.js";
router.post("/submit-beta", submitBeta);

export default router;
