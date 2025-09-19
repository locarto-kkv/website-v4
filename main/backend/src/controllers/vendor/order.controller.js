import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: productIds } = await db
      .from("product")
      .select("id")
      .eq("vendor_id", userId);

    const { data: orders } = await db
      .from("orders")
      .select()
      .eq("product_id", productIds);

    res.status(200).json(orders);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order_status } = req.body;

    const { data: updatedOrder } = await db
      .from("orders")
      .update({ order_status })
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json(updatedOrder);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
