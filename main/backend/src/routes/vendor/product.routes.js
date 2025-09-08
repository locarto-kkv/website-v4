import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProducts,
  addProduct,
  removeProduct,
  editProduct,
} from "../../controllers/vendor/product.controller.js";

const router = Router();

router.get("/", protectRoute, getProducts);
router.get("/:id", protectRoute, getProducts);
router.post("/add", protectRoute, addProduct);
router.put("/:id", protectRoute, editProduct);
router.delete("/:id", protectRoute, removeProduct);

export default router;
