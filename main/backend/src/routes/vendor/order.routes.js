import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getOrders,
  updateOrderStatus,
} from "../../controllers/vendor/order.controller.js";

const router = Router();

// router.patch("/cancel-order/:id", protectRoute, cancelOrderTransaction);
router.get("/", protectRoute("vendor"), getOrders);
router.put("/update-status/:id", protectRoute("vendor"), updateOrderStatus);

export default router;
