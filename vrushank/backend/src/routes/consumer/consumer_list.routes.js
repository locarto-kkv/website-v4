import { Router } from "express";
import { protectRoute } from "../../middleware/consumer/auth.middleware.js";
import {
  getListItems,
  removeFromList,
  updateList,
} from "../../controllers/consumer/consumer_list.controller.js";

const router = Router();

router.get("/", getListItems);
router.patch("/:id", protectRoute, updateList);
router.delete("/:id", protectRoute, removeFromList);

export default router;
