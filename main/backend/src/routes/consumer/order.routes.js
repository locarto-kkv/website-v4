import { Router } from "express";
import {
  placeOrder,
  getOrderHistory,
  cancelOrderItem,
} from "../../controllers/consumer/order.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute("consumer"), getOrderHistory);
router.post("/place-order", protectRoute("consumer"), placeOrder);
router.put("/cancel-order/:itemId", protectRoute("consumer"), cancelOrderItem);

export default router;
