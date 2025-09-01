import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProducts,
  removeProduct,
  editProduct,
} from "../../controllers/admin/product.controller.js";
// import { upload } from "../../lib/admin/upload.js";

const router = Router();

router.get("/", protectRoute, getProducts);
// router.post(
//   "/upload",
//   protectRoute,
//   upload.array("product_images", 10),
//   uploadImages
// );
router.put("/:id", protectRoute, editProduct);
router.delete("/:id", protectRoute, removeProduct);

export default router;
