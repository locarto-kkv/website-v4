import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getRandom = async (req, res) => {
  try {
    const { limit } = req.query;

    const { data: products, error1 } = await db.rpc("get_random_products", {
      limit_count: limit,
    });

    if (error1) throw error1;

    const { data: vendors, error2 } = await db.rpc("get_random_vendors", {
      limit_count: limit,
    });

    if (error2) throw error2;

    res.status(200).json({ products, vendors });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getRandom",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
