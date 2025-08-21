import { Router } from "express";
import { protectRoute } from "../../middleware/vendor/auth.middleware.js";
import {
  getProducts,
  addProduct,
  uploadImages,
  removeProduct,
  editProduct,
} from "../../controllers/vendor/product.controller.js";
import { upload } from "../../lib/vendor/upload.js";

const router = Router();

router.get("/", protectRoute, getProducts);
router.post("/add", protectRoute, addProduct);
router.post(
  "/upload",
  protectRoute,
  upload.array("product_images", 10),
  uploadImages
);
router.put("/:id", protectRoute, editProduct);
router.delete("/:id", protectRoute, removeProduct);

export default router;
