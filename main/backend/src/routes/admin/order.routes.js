import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProducts,
  addProduct,
  removeProduct,
  editProduct,
} from "../../controllers/admin/order.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/add", protectRoute("admin"), addProduct);
router.delete("/:id", protectRoute("admin"), removeProduct);
router.put("/:id", protectRoute("admin"), editProduct);

export default router;
