import { Router } from "express";
import {
  signup,
  login,
  logout,
  loginGoogle,
} from "../../controllers/vendor/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/login-google", loginGoogle);
router.post("/logout", logout);

export default router;
