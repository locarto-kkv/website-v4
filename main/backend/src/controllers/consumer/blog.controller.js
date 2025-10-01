import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getBlogs = async (req, res) => {
  try {
    const { data: blogs } = await db.from("blogs").select();

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
