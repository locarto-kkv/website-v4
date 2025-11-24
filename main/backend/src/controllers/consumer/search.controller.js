import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getSearchResults = async (req, res) => {
  try {
    const { query, type } = req.query;
    const limit = 5;

    if (type === "product") {
      const { data: products, error: productError } = await db
        .from("products")
        .select("id, name, product_uuid")
        .eq("base", true)
        .ilike("name", `${query}%`)
        .order("name", { ascending: true })
        .limit(limit);

      if (productError) throw productError;
      return res.status(200).json({ products });
    } else if (type === "vendor") {
      const { data: vendors, error: vendorError } = await db
        .from("vendors")
        .select("id, name")
        .eq("status", "verified")
        .ilike("name", `${query}%`)
        .order("name", { ascending: true })
        .limit(limit);

      if (vendorError) throw vendorError;
      return res.status(200).json({ vendors });
    } else if (type === "all") {
      const { data: products, error: productError } = await db
        .from("products")
        .select("id, name, product_uuid")
        .eq("base", true)
        .ilike("name", `${query}%`)
        .order("name", { ascending: true })
        .limit(limit);

      if (productError) throw productError;

      const { data: vendors, error: vendorError } = await db
        .from("vendors")
        .select("id, name")
        .eq("status", "verified")
        .ilike("name", `${query}%`)
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
      func: "getRandom",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
