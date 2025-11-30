import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getOrderByFilter,
  updateOrder,
  updateOrderItem,
} from "../../controllers/admin/order.controller.js";

const router = Router();

router.get("/", protectRoute("admin"), getOrderByFilter);
router.put("/update-order/:orderId", protectRoute("admin"), updateOrder);
router.put("/update-item/:orderItemId", protectRoute("admin"), updateOrderItem);

export default router;
