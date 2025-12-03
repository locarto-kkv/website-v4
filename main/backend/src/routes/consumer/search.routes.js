import { Router } from "express";
import {
  getSearchResults,
  getSimilarResults,
} from "../../controllers/consumer/search.controller.js";

const router = Router();

router.get("/", getSearchResults);
router.get("/similar", getSimilarResults);

export default router;
