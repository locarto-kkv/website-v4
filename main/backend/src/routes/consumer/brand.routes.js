import { Router } from "express";
import { getBrands } from "../../controllers/consumer/brand.controller.js";

const router = Router();

router.get("/", getBrands);

export default router;
