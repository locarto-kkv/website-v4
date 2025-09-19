import {
  addOrder,
  cancelOrder,
} from "../../services/consumer/order.service.js";
import {
  addTransaction,
  cancelTransaction,
} from "../../services/consumer/transaction.service.js";
import logger from "../../lib/logger.js";
import db from "../../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: ordersWithRelations, error } = await db
      .from("orders")
      .select(
        `
    *,
    product:products (*),
    transaction:transactions (*)
  `
      )
      .eq("consumer_id", userId);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    res.status(200).json(ordersWithRelations);
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

export const placeOrderTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, order, transaction } = req.body;

    const newOrder = await addOrder(userId, productId, order);

    const newTransaction = await addTransaction(newOrder.id, transaction);

    res.status(200).json({ order: newOrder, transaction: newTransaction });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "placeOrderTransaction",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrderTransaction = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await cancelOrder(orderId);

    const updatedTransaction = await cancelTransaction(orderId);

    res.status(200).json({
      message: "Order cancelled successfully",
      orders: updatedOrder,
      transactions: updatedTransaction,
    });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "cancelOrderTransaction",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
