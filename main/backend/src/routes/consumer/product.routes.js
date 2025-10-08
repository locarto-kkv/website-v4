import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProductsByCategory,
  getProductsByVendor,
  getProducts,
} from "../../controllers/consumer/product.controller.js";

const router = Router();

router.get("/", (req, res) => {
  if (req.query.category) {
    return getProductsByCategory(req, res);
  }
  if (req.query.vendor_id) {
    return getProductsByVendor(req, res);
  }
  // return all products
  return getProducts(req, res);
});

export default router;
