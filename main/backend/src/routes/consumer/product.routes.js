import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getProductsByCategory,
  getProductById,
  getAllProducts,
} from "../../controllers/consumer/product.controller.js";

const router = Router();

router.get("/", (req, res) => {
  if (req.query.category) {
    return getProductsByCategory(req, res);
  }
  if (req.query.id) {
    return getProductById(req, res);
  }
  // return all products
  return getAllProducts(req, res);
});

export default router;
