import { Router } from "express";
import { protectRoute } from "../../middleware/vendor/auth.middleware.js";
import { getTransactions } from "../../controllers/vendor/transaction.controller.js";

const router = Router();

router.get("/", protectRoute, getTransactions);

export default router;
