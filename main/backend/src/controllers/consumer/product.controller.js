import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const batchSize = 10;

export const getProductsByFilter = async (req, res) => {
  try {
    const { filters = {}, start = 0 } = req.query;
    const start_index = parseInt(start, 10) || 0;

    // Parse filters if it's a JSON string
    let parsedFilters = filters;
    if (typeof filters === "string") {
      try {
        parsedFilters = JSON.parse(filters);
      } catch {
        return res
          .status(400)
          .json({ message: "Invalid filters format. Must be valid JSON." });
      }
    }

    // Base query
    let query = db
      .from("products")
      .select()
      .range(start_index, start_index + batchSize)
      .eq("status", "available")
      .order("id", { ascending: true });

    // Dynamically apply filters
    for (const [key, value] of Object.entries(parsedFilters)) {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    }

    const { data: products, error: productError } = await query;

    if (productError) throw productError;
    if (!products || products.length === 0) return res.status(200).json([]);

    // Fetch summaries
    const productIds = products.map((p) => p.id);
    const { data: summary, error: summaryError } = await db
      .from("total_product_summary")
      .select()
      .in("product_id", productIds);

    if (summaryError) throw summaryError;

    // Merge product + summary data
    const agg_products = products.map((p) => {
      const sum = summary.find((s) => s.product_id === p.id);
      return { ...p, ...sum };
    });

    res.status(200).json(agg_products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProductsByFilter",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
