import { Router } from "express";
import {
  cancelOrder,
  placeOrder,
  getOrderHistory,
} from "../../controllers/consumer/order.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute("consumer"), getOrderHistory);
router.post("/place-order", protectRoute("consumer"), placeOrder);
router.patch("/cancel-order/:id", protectRoute("consumer"), cancelOrder);

export default router;
