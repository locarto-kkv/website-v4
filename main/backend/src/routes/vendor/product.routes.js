import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  addProduct,
  removeProduct,
  editProduct,
} from "../../controllers/vendor/product.controller.js";

const router = Router();

router.post("/add", protectRoute("vendor"), addProduct);
router.put("/edit/:productId", protectRoute("vendor"), editProduct);
router.delete("/delete/:productId", protectRoute("vendor"), removeProduct);

export default router;
