import { Router } from "express";

import authRoutes from "./auth.route.js";
import productRoutes from "./product.routes.js";
import profileRoutes from "./profile.routes.js";
import orderRoutes from "./order.routes.js";
import transactionRoutes from "./transaction.routes.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/profile", profileRoutes);
router.use("/order", orderRoutes);
router.use("/review", reviewRoutes);
router.use("/transaction", transactionRoutes);

export default router;
