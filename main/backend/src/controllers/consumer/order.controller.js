import logger from "../../lib/logger.js";
import db from "../../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: orders, error } = await db
      .from("orders")
      .select(
        `*,
        items: order_items_order_id_fkey(*,
        review: reviews_order_item_id_fkey(*)
        )
        `
      )
      .eq("consumer_id", userId);

    if (error) throw error;

    res.status(200).json(orders);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getOrderHistory",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address, ...order } = req.body;

    const orderData = {
      ...order,
      consumer_id: userId,
    };

    const { data: newOrder, error } = await db.rpc("create_order", {
      payload: orderData,
    });

    if (error) throw error;

    const itemsData = [];

    const status = {
      payment_status: orderData.payment_date ? "paid" : "pending",
      support_status: "open",
      order_status: "pending",
    };

    items.map((item) => {
      const itemData = {
        ...item,
        ...status,
        order_id: newOrder.id,
      };
      itemsData.push(itemData);
    });

    const { data: newOrderItems, error2 } = await db.rpc("create_order_items", {
      itemsdata: itemsData,
    });

    if (error2) throw error2;

    getOrderHistory(req, res);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "placeOrder",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrderItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const { data: item } = await db
      .from("order_items")
      .select()
      .eq("id", itemId)
      .single();

    const itemData = {
      ...item,
      payment_status: item.payment_date ? "refunding" : "cancelled",
      support_status: "open",
      order_status: "cancelled",
    };

    const { data: updatedOrderItems } = await db
      .from("order_items")
      .upsert(itemData)
      .select();

    getOrderHistory(req, res);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "cancelOrderItem",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
