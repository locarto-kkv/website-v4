import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getProducts } from "../../controllers/consumer/product.controller.js";

const router = Router();

router.get("/", getProducts);

export default router;
