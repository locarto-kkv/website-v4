import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  cancelOrder,
  getOrders,
} from "../../controllers/consumer/order.controller.js";

const router = Router();

router.get("/", protectRoute, getOrders);
router.put("/cancel/:id", protectRoute, cancelOrder);

export default router;
