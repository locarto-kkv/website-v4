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
        product: order_items_product_id_fkey(*),          
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

    const { data: newOrder, error } = await db
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;

    const itemsData = [];

    const status = {
      payment_status: orderData.payment_date ? "paid" : "pending",
      support_status: "open",
      order_status: "confirmed",
    };

    items.map((item) => {
      const itemData = {
        ...item,
        ...status,
        order_id: newOrder.id,
      };
      itemsData.push(itemData);
    });

    const { data: newOrderItems, error2 } = await db
      .from("order_items")
      .insert(itemsData)
      .select();

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

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: items } = await db
      .from("order_items")
      .select()
      .eq("order_id", orderId);

    const itemsData = [];

    items.map((item) => {
      const itemData = {
        ...item,
        payment_status: item.payment_date ? "refunded" : "cancelled",
        support_status: "open",
        order_status: "cancelled",
      };
      itemsData.push(itemData);
    });

    const { data: updatedOrderItems } = await db
      .from("order_items")
      .upsert(itemsData)
      .select();

    getOrderHistory(req, res);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "cancelOrder",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
