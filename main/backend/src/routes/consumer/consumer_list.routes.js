import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getListItems,
  removeFromList,
  updateList,
} from "../../controllers/consumer/consumer_list.controller.js";

const router = Router();

router.get("/", protectRoute("consumer"), getListItems);
router.patch("/:id", protectRoute("consumer"), updateList);
router.delete("/:id", protectRoute("consumer"), removeFromList);

export default router;
