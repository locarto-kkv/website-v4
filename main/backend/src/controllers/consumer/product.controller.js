import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getAllProducts = async (req, res) => {
  try {
    const { data: products } = await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getAllProducts",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.query.id;
    const { data: products } = await db
      .from("products")
      .select()
      .eq("id", productId)
      .single();

    res.status(200).json(products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProductById",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const { data: products } = await db
      .from("products")
      .select()
      .eq("category", category)
      .single();

    res.status(200).json(products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProductsByCategory",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
