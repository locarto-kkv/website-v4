import { Router } from "express";
import {
  sendVerification,
  signup,
  login,
  logout,
  loginGoogle,
} from "../../controllers/consumer/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
const router = Router();

router.post("/verify", sendVerification);
router.post("/signup", signup);
router.post("/login", login);
router.get("/login-google", loginGoogle);
router.post("/logout", protectRoute("consumer"), logout);

export default router;
