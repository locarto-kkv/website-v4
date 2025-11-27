import { Router } from "express";
import { searchConsumers } from "../../controllers/admin/search.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute("admin"), searchConsumers);

export default router;
