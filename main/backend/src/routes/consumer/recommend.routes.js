import { Router } from "express";
import { getRandom } from "../../controllers/consumer/recommend.controller.js";

const router = Router();

router.get("/", getRandom);

export default router;
