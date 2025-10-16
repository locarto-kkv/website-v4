import { Router } from "express";
import { getProductsByFilter } from "../../controllers/consumer/product.controller.js";

const router = Router();

router.get("/", getProductsByFilter);

export default router;
