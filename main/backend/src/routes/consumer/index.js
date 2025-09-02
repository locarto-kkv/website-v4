import { Router } from "express";

import authRoutes from "./auth.route.js";
import productRoutes from "./product.routes.js";
import profileRoutes from "./profile.routes.js";
import orderTransactionRoutes from "./orderTransaction.route.js";
import reviewRoutes from "./review.routes.js";
import listRoutes from "./consumer_list.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/profile", profileRoutes);
router.use("/order", orderTransactionRoutes);
router.use("/review", reviewRoutes);
router.use("/list", listRoutes);

export default router;
