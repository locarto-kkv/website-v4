import { Router } from "express";
import {
  signup,
  login,
  logout,
  sendVerification,
  loginGoogle,
} from "../../controllers/vendor/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/verify", sendVerification);
router.post("/signup", signup);
router.post("/login", login);
router.get("/login-google", loginGoogle);
router.post("/logout", protectRoute("vendor"), logout);

export default router;
