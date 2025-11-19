import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getOrders,
  updateOrderStatus,
} from "../../controllers/vendor/order.controller.js";

const router = Router();

router.get("/", protectRoute("vendor"), getOrders);
router.patch(
  "/update-status/:orderItemId",
  protectRoute("vendor"),
  updateOrderStatus
);

export default router;
