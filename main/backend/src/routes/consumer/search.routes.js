import { Router } from "express";
import { getSearchResults } from "../../controllers/consumer/search.controller.js";

const router = Router();

router.get("/", getSearchResults);

export default router;
