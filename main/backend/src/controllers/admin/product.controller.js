import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const restrictProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    const { data: products } = await db
      .from("products")
      .update({ status })
      .eq("id", productId);

    res.status(200).json(products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "restrictProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
