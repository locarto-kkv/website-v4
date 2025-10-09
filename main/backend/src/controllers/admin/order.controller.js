import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { getFileUploadUrl } from "../../services/file.service.js";
import { env } from "../../lib/env.js";

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
    const orderData = req.body;

    let fileUploadUrl = null;

    if (orderData.invoice) {
      fileUploadUrl = await getFileUploadUrl(
        orderId,
        orderData.invoice,
        "order-invoices"
      );

      const filePublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/order-invoices/${fileUploadUrl.filePath}`;

      orderData.invoice = filePublicUrl;
    }

    const { data: updatedOrder } = await db
      .from("orders")
      .update(orderData)
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json({ blog: updatedOrder, fileUploadUrl });
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
