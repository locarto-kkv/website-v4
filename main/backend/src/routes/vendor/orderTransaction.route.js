import { Router } from "express";
import { getVendorOrders } from "../../controllers/vendor/orderTransaction.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/get-orders", protectRoute, getVendorOrders);
// router.post("/place-order", protectRoute, placeOrderTransaction);
// router.patch("/cancel-order/:id", protectRoute, cancelOrderTransaction);

export default router;
