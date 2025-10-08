import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../../controllers/vendor/order.controller.js";

const router = Router();

router.get("/", protectRoute("vendor"), getOrders);
router.patch("/cancel-order/:orderId", protectRoute("vendor"), cancelOrder);
router.put(
  "/update-status/:orderId",
  protectRoute("vendor"),
  updateOrderStatus
);

export default router;
