import { Router } from "express";
import {
  sendVerification,
  signup,
  login,
  logout,
  loginGoogle,
} from "../../controllers/consumer/auth.controller.js";

const router = Router();

router.post("/verify", sendVerification);
router.post("/signup", signup);
router.post("/login", login);
router.post("/login-google", loginGoogle);
router.post("/logout", logout);

export default router;
