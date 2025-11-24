import { Router } from "express";
import {
  getProductsByFilter,
  getProductVariants,
} from "../../controllers/consumer/product.controller.js";

const router = Router();

router.get("/", getProductsByFilter);
router.get("/:product_uuid", getProductVariants);

export default router;
