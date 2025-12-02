import db from "../../lib/db.js";
// import { cancelOrderService } from "../../services/order.service.js";

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
        items: order_items_order_id_fkey(*,
        product: order_items_product_id_fkey(*)
        )
        `
      )
      .eq("items.product.vendor_id", vendorId)
      .not("items.product", "is", null)
      .not("items", "is", null);

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
    const { order_status, itemIds } = req.body;

    const { data: updatedOrder } = await db
      .from("order_items")
      .update(order_status)
      .in("id", itemIds)
      .select();

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
