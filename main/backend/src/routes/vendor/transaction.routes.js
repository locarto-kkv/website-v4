import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getTransactions } from "../../controllers/vendor/transaction.controller.js";

const router = Router();

router.get("/", protectRoute("vendor"), getTransactions);

export default router;
