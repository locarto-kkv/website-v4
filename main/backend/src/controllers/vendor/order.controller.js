import db from "../../lib/db.js";
import { cancelOrderService } from "../../services/order.service.js";

import logger from "../../lib/logger.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrders = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const { data: orders, error } = await db
      .from("orders")
      .select(
        `*,
        product: orders_product_id_fkey(*)
        `
      )
      .eq("product.vendor_id", vendorId)
      .not("product", "is", null);

    if (error) throw error;

    res.status(200).json(orders);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getOrders",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    const { data: updatedOrder } = await db
      .from("orders")
      .update({ order_status })
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json(updatedOrder);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "updateOrderStatus",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

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
