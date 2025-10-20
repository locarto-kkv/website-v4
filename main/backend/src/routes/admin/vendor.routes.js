import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { authoriseVendor } from "../../controllers/admin/vendor.controller.js";

const router = Router();

router.patch("/authorise/:vendorId", protectRoute("admin"), authoriseVendor);

export default router;
