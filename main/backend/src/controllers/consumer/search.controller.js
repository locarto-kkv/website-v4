import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { getEmbedding } from "../../services/consumer/gpt.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// only for search bar autocomplete
export const getSearchResults = async (req, res) => {
  try {
    const { query, type } = req.query;
    const limit = 5;

    const searchPattern = `%${query}%`;

    if (type === "product") {
      const { data: products, error: productError } = await db
        .from("products")
        .select("id, name, product_uuid")
        .eq("base", true)
        .ilike("name", searchPattern)
        .order("name", { ascending: true })
        .limit(limit);

      if (productError) throw productError;
      return res.status(200).json({ products });
    } else if (type === "vendor") {
      const { data: vendors, error: vendorError } = await db
        .from("vendors")
        .select("id, name")
        .eq("status", "verified")
        .ilike("name", searchPattern)
        .order("name", { ascending: true })
        .limit(limit);

      if (vendorError) throw vendorError;
      return res.status(200).json({ vendors });
    } else if (type === "all") {
      const { data: products, error: productError } = await db
        .from("products")
        .select("id, name, product_uuid")
        .eq("base", true)
        .ilike("name", searchPattern)
        .order("name", { ascending: true })
        .limit(limit);

      if (productError) throw productError;

      const { data: vendors, error: vendorError } = await db
        .from("vendors")
        .select("id, name")
        .eq("status", "verified")
        .ilike("name", searchPattern)
        .order("name", { ascending: true })
        .limit(limit);

      if (vendorError) throw vendorError;
      return res.status(200).json({ products, vendors });
    }

    return res.status(400).json({ message: `Invalid type = ${type}` });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getSearchResults",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get similar products based on current user query
export const getSimilarResults = async (req, res) => {
  try {
    const query = req.query;
    const limit = 6;

    const searchPattern = `%${query}%`;
    // const embedding = await getEmbedding(query);

    const { data: queryProducts, error: queryError } = await db
      .from("products")
      .select("id, name, product_uuid")
      .eq("base", true)
      .ilike("name", searchPattern)
      .order("name", { ascending: true })
      .limit(limit);

    // const {data: similarProducts, error: similarError} = db.rpc("", {embedding, limit})
    // return res.status(200).json(queryProducts, similarProducts);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getSimilarResults",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
