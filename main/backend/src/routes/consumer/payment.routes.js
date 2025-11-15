import { Router } from "express";
import {
  initiatePayment,
  validatePayment,
} from "../../controllers/consumer/payment.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/initiate", protectRoute("consumer"), initiatePayment);
router.post("/validate", protectRoute("consumer"), validatePayment);

export default router;
