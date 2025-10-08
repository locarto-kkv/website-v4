import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getTransactions } from "../../controllers/admin/transaction.controller.js";

const router = Router();

router.get("/", protectRoute("admin"), getTransactions);
// router.post("/add", protectRoute, addProduct);
// router.delete("/:id", protectRoute, removeProduct);
// router.put("/:id", protectRoute, editProduct);

export default router;
