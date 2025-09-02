import { Router } from "express";
import {
  cancelOrderTransaction,
  getOrderHistory,
  placeOrderTransaction,
} from "../../controllers/consumer/orderTransaction.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/get-orders", protectRoute, getOrderHistory);
router.post("/place-order", protectRoute, placeOrderTransaction);
router.patch("/cancel-order/:id", protectRoute, cancelOrderTransaction);

export default router;
