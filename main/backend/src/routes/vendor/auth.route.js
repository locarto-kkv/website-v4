import { Router } from "express";
import {
  signup,
  login,
  logout,
} from "../../controllers/vendor/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

export default router;
