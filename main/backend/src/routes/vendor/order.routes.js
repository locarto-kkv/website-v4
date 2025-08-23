import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getOrders,
  updateOrderStatus,
} from "../../controllers/vendor/order.controller.js";

const router = Router();

router.get("/", getOrders);
router.put("/update-status/:id", protectRoute, updateOrderStatus);

export default router;
