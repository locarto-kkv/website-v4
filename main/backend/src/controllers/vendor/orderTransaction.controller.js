import { cancelOrder } from "../../services/vendor/order.service.js";
import { cancelTransaction } from "../../services/vendor/transaction.service.js";
import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const { data: ordersWithRelations, error } = await db
      .from("orders")
      .select(
        `
        *,
        product:products (
          *,
          vendor:vendors (*)
        ),
        transaction:transactions (*)
      `
      )
      .eq("product.vendor_id", vendorId);

    if (error) {
      // console.error(error);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    res.status(200).json(ordersWithRelations);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getVendorOrders",
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
