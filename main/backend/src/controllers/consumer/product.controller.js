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
      } catch (error) {
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
      .eq("base", true)
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

    // // Fetch summaries
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

export const getProductVariants = async (req, res) => {
  try {
    const { product_uuid } = req.params;

    const { data, error } = await db
      .from("products")
      .select(
        `*, items: order_items_product_id_fkey(id, 
          review: reviews_order_item_id_fkey(*)
        )`
      )
      .eq("product_uuid", product_uuid);

    if (error) throw error;

    if (!data || data.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const base = data[0];
    const allReviews = [];

    // -----------------------------------------
    // 1) COLLECT REVIEWS
    // -----------------------------------------
    for (const product of data) {
      if (product.items?.length) {
        for (const item of product.items) {
          if (item.review) {
            allReviews.push(item.review);
          }
        }
      }
    }

    // Review stats
    const count_reviews = allReviews.length;
    const avg_review =
      count_reviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / count_reviews
        : 0;

    // -----------------------------------------
    // 2) CHECK IF ATTRIBUTE_TYPE EXISTS
    // -----------------------------------------

    // ❌ No variants → return base product only
    if (data.length === 1) {
      const singleItem = {
        id: base.id,
        name: base.name,
        description: base.description,
        price: base.price,
        quantity: base.quantity,
        weight: base.weight,
        product_images: base.product_images,
        status: base.status,
        created_at: base.created_at,
        cod: base.cod,
        replace: base.replace,
        return_refund: base.return_refund,
      };

      const response = {
        product_uuid: base.product_uuid,
        vendor_id: base.vendor_id,
        category: base.category,
        variants: {},
        base: singleItem,
        reviews: allReviews,
        avg_review,
        count_reviews,
        count_variants: 1,
      };

      return res.status(200).json(response);
    }

    // -----------------------------------------
    // 3) GROUP VARIANTS (variants exists)
    // -----------------------------------------
    const variants = {};

    for (const product of data) {
      const {
        id,
        name,
        description,
        price,
        quantity,
        weight,
        attribute_name,
        attribute_type,
        base,
        product_images,
        status,
        cod,
        replace,
        return_refund,
      } = product;

      if (!variants[attribute_type]) variants[attribute_type] = [];
      const variantData = base
        ? {
            id,
            name,
            description,
            price,
            quantity,
            weight,
            attribute_name,
            base,
            product_images,
            status,
            cod,
            replace,
            return_refund,
          }
        : {
            id,
            name,
            description,
            price,
            quantity,
            weight,
            attribute_name,
            base,
            product_images,
            status,
          };
      variants[attribute_type].push(variantData);
    }

    const count_variants = data.length;

    const response = {
      product_uuid: base.product_uuid,
      vendor_id: base.vendor_id,
      category: base.category,
      variants,
      reviews: allReviews,
      avg_review,
      count_reviews,
      count_variants,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProductVariants",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
