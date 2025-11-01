import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getBlogs = async (req, res) => {
  try {
    const { start } = req.query;
    const start_index = parseInt(start, 10);

    const { data: blogs, error } = await db
      .from("vendors")
      .select(
        `name, email, phone_no, brand_logo_1, brand_logo_2, status, website,
      blog: blogs_vendor_id_fkey(*),
      address: addresses_vendor_id_fkey(*)`
      )
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
