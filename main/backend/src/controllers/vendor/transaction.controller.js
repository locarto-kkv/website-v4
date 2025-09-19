import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: productIds } = await db
      .from("products")
      .select("id")
      .eq("vendor_id", userId);

    const { data: orderIds } = await db
      .from("orders")
      .select("id")
      .eq("product_id", productIds);

    const { data: transactions } = await db
      .from("transactions")
      .select()
      .eq("order_id", orderIds);

    res.status(200).json(transactions);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getTransactions",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
