import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  addProduct,
  removeProduct,
  editProduct,
} from "../../controllers/vendor/product.controller.js";

const router = Router();

router.post("/add", protectRoute("vendor"), addProduct);
router.put("/edit/:id", protectRoute("vendor"), editProduct);
router.delete("/delete/:id", protectRoute("vendor"), removeProduct);

export default router;
