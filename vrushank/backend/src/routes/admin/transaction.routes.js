import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProducts,
  addProduct,
  removeProduct,
  editProduct,
} from "../../controllers/vendor/transaction.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/add", protectRoute, addProduct);
router.delete("/:id", protectRoute, removeProduct);
router.put("/:id", protectRoute, editProduct);

export default router;
