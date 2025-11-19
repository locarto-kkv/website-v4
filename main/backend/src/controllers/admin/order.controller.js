import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { getFileUploadUrl } from "../../services/file.service.js";
import { env } from "../../lib/env.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: items } = await db
      .from("order_items")
      .select()
      .eq("order_id", orderId);

    res.status(200).json(items);
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
    const orderData = req.body;

    let fileUploadUrl = null;

    if (orderData.shipping_label) {
      fileUploadUrl = await getFileUploadUrl(
        orderId,
        orderData.shipping_label,
        "order-invoices"
      );

      const filePublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/order-invoices/${fileUploadUrl.filePath}`;

      orderData.shipping_label = filePublicUrl;
    }

    const { data: updatedOrder } = await db
      .from("orders")
      .update(orderData)
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json({ order: updatedOrder, fileUploadUrl });
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
