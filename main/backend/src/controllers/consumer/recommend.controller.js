import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { getEmbedding } from "../../services/consumer/gpt.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getRandom = async (req, res) => {
  try {
    const { limit } = req.query;

    const { data: products, error1 } = await db.rpc("get_random_products", {
      limit_count: limit,
    });

    if (error1) throw error1;

    const { data: vendors, error2 } = await db.rpc("get_random_vendors", {
      limit_count: limit,
    });

    if (error2) throw error2;

    res.status(200).json({ products, vendors });
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

// get product recommendations based on user data or past order data
export const getRecommends = async (req, res) => {
  try {
    const data = req.query;
    // input query to getEmbedding and get embedding
    // input embedding into supabase rpc to get top k similar product ids
    // add them to req.body.filters = {id: [ids]}
    // call getproductsbyfilter(req, res)
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getRecommends",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
