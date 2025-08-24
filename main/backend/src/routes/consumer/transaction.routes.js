import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getTransactions } from "../../controllers/consumer/transaction.controller.js";

const router = Router();

router.get("/", getTransactions);

export default router;
