import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getOrderById,
  editOrder,
} from "../../controllers/admin/order.controller.js";

const router = Router();

router.get("/:orderId", protectRoute("admin"), getOrderById);
router.put("/edit/:orderId", protectRoute("admin"), editOrder);

export default router;
