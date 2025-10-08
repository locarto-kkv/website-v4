import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order } = await db
      .from("orders")
      .select()
      .eq("id", orderId)
      .single();

    res.status(200).json(order);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getOrderById",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order } = req.body;

    const { data: updatedOrder } = await db
      .from("order")
      .update(order)
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json(updatedOrder);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "editOrder",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
