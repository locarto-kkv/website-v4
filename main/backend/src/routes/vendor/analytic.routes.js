import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getAnalytics } from "../../controllers/vendor/analytic.controller.js";

const router = Router();

router.get("/", protectRoute("vendor"), getAnalytics);

export default router;
