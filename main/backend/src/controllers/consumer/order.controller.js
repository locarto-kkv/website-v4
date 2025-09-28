import {
  addOrderService,
  cancelOrderService,
} from "../../services/consumer/order.service.js";

import logger from "../../lib/logger.js";
import db from "../../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: orders, error } = await db
      .from("orders")
      .select(
        `
    *,
    product:products (*)
  `
      )
      .eq("consumer_id", userId);

    if (error) {
      logger({
        level: "error",
        message: error.message,
        location: __filename,
        func: "getOrderHistory",
      });
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    res.status(200).json(orders);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getOrderHistory",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, order } = req.body;

    const newOrder = await addOrderService(userId, productId, order);

    res.status(200).json({ order: newOrder });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "placeOrder",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await cancelOrderService(orderId);

    res.status(200).json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "cancelOrder",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
