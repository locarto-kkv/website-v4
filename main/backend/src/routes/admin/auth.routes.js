import { Router } from "express";
import { login, logout } from "../../controllers/admin/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", protectRoute("admin"), logout);

export default router;
