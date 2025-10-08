import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const batchSize = 10;

export const getProducts = async (req, res) => {
  try {
    const { start } = req.query;
    const start_index = parseInt(start, 10);

    const { data: products } = await db
      .from("products")
      .select()
      .eq("status", "available")
      .range(start_index, start_index + batchSize)
      .order("id", { ascending: true });

    const productIds = products.map((p) => p.id);

    const { data: summary } = await db
      .from("total_product_summary")
      .select()
      .in("product_id", productIds);

    const agg_products = products.map((p) => {
      const sum = summary.filter((s) => s.product_id === p.id);

      return { ...p, ...sum[0] };
    });

    res.status(200).json(agg_products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProducts",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductsByVendor = async (req, res) => {
  try {
    const { vendor_id: vendorId, start } = req.query;
    const start_index = parseInt(start, 10);

    const { data: products } = await db
      .from("products")
      .select()
      .range(start_index, start_index + batchSize)
      .eq("vendor_id", vendorId)
      .eq("status", "available")
      .order("id", { ascending: true });

    const productIds = products.map((p) => p.id);

    const { data: summary } = await db
      .from("total_product_summary")
      .select()
      .in("product_id", productIds);

    const agg_products = products.map((p) => {
      const sum = summary.filter((s) => s.product_id === p.id);

      return { ...p, ...sum[0] };
    });

    res.status(200).json(agg_products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProductsByVendor",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category, start } = req.query;
    const start_index = parseInt(start, 10);

    const { data: products } = await db
      .from("products")
      .select()
      .range(start_index, start_index + batchSize)
      .eq("category", category)
      .eq("status", "available")
      .order("id", { ascending: true });

    const productIds = products.map((p) => p.id);

    const { data: summary } = await db
      .from("total_product_summary")
      .select()
      .in("product_id", productIds);

    const agg_products = products.map((p) => {
      const sum = summary.filter((s) => s.product_id === p.id);

      return { ...p, ...sum[0] };
    });

    res.status(200).json(agg_products);
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
