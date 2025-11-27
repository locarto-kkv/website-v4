import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  addProduct,
  addProductVariant,
  deleteProduct,
  editProduct,
} from "../../controllers/vendor/product.controller.js";

const router = Router();

router.post("/add", protectRoute("vendor"), addProduct);
router.post("/add-variant", protectRoute("vendor"), addProductVariant);
router.put("/edit/:productId", protectRoute("vendor"), editProduct);
router.delete("/delete/:productId", protectRoute("vendor"), deleteProduct);

export default router;
