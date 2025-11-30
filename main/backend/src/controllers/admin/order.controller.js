import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrderByFilter = async (req, res) => {
  try {
    const { filters = {}, start = 0, limit = 10 } = req.query;

    const parsedFilters =
      typeof filters === "string" ? JSON.parse(filters) : filters || {};

    let query = db.from("order_items").select(
      `
        *,
        order:orders!inner (*)
      `,
      { count: "exact" }
    );

    if (parsedFilters.order_id) {
      query = query.eq("orders.id", parsedFilters.order_id);
    }

    if (parsedFilters.vendor_id) {
      query = query.eq("orders.vendor_id", parsedFilters.vendor_id);
    }

    if (parsedFilters.consumer_id) {
      query = query.eq("orders.consumer_id", parsedFilters.consumer_id);
    }

    if (parsedFilters.product_id) {
      query = query.eq("product_id", parsedFilters.product_id);
    }

    if (parsedFilters.date) {
      const now = new Date();
      let startDate = null;
      now.setHours(0, 0, 0, 0);

      switch (parsedFilters.date) {
        case "today":
          startDate = now.toISOString();
          break;
        case "this_week":
          const day = now.getDay();
          const diff = now.getDate() - day;
          const startOfWeek = new Date(now.setDate(diff));
          startDate = startOfWeek.toISOString();
          break;
        case "this_month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate = startOfMonth.toISOString();
          break;
      }

      if (startDate) {
        query = query.gte("orders.created_at", startDate);
      }
    }
    const from = parseInt(start);
    const to = from + parseInt(limit) - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      data,
      count,
      page_start: from,
    });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getOrderByFilter",
    });
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const itemData = req.body;

    const { data: updatedItem } = await db
      .from("order_items")
      .update(itemData)
      .eq("id", orderItemId)
      .select()
      .single();

    res.status(200).json(updatedItem);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "updateOrderItem",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderData = req.body;

    const { data: updatedOrder } = await db
      .from("orders")
      .update(orderData)
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json(updatedOrder);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "updateOrder",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
