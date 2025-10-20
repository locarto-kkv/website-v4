import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const authoriseVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.body;

    const { data: vendor } = await db
      .from("vendors")
      .update({ status })
      .eq("id", vendorId);

    res.status(200).json(vendor);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "authoriseVendor",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
