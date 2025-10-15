import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getListItems,
  removeFromList,
  updateList,
} from "../../controllers/consumer/consumer_list.controller.js";

const router = Router();

router.get("/", protectRoute("consumer"), getListItems);
router.patch("/update/:productId", protectRoute("consumer"), updateList);
router.delete("/delete/:productId", protectRoute("consumer"), removeFromList);

export default router;
