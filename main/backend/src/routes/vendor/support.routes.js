import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/:vendorId", protectRoute("vendor"));

export default router;
