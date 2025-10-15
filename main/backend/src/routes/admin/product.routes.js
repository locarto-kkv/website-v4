import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { restrictProduct } from "../../controllers/admin/product.controller.js";

const router = Router();

router.patch("/restrict/:productId", protectRoute("admin"), restrictProduct);

export default router;
