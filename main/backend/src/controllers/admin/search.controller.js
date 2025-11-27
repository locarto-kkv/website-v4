import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const searchConsumers = async (req, res) => {
  try {
    const { query } = req.query;
    const limit = 5;

    const searchPattern = `%${query}%`;

    const { data: consumers, error } = await db
      .from("consumers")
      .select("id, name, email")
      .ilike("name", searchPattern)
      .order("name", { ascending: true })
      .limit(limit);

    return res.status(200).json(consumers);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "searchConsumers",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
