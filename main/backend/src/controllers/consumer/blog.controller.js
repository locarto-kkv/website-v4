import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const batchSize = 10;

export const getBlogs = async (req, res) => {
  try {
    const { start } = req.query;
    const start_index = parseInt(start, 10);

    const { data: blogs } = await db
      .from("blogs")
      .select(
        `title,
      vendor: vendors(*)`
      )
      .range(start_index, start_index + batchSize)
      .order("id", { ascending: true });

    res.status(200).json(blogs);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getBlogs",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
