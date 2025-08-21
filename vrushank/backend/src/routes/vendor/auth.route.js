import { Router } from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../../controllers/vendor/auth.controller.js";
import { protectRoute } from "../../middleware/vendor/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

export default router;
