import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getListItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: listItems } = await db
      .from("consumer_lists")
      .select("list_type, quantity, product_id, product: products(*)")
      .eq("consumer_id", userId);

    const groupedList = listItems.reduce((acc, item) => {
      const { list_type, quantity, product_id, product } = item;
      if (!acc[list_type]) {
        acc[list_type] = [];
      }
      acc[list_type].push({ ...product, product_id, quantity });
      return acc;
    }, {});

    res.status(200).json(groupedList);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getListItems",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type: list_type, quantity } = req.body;
    const { productId } = req.params;

    const { data: updatedList, error } = await db.from("consumer_lists").upsert(
      {
        consumer_id: userId,
        list_type,
        product_id: productId,
        quantity,
      },
      { onConflict: ["consumer_id", "list_type", "product_id"] }
    );

    if (error) throw error;

    getListItems(req, res);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "updateList",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type: list_type } = req.body;
    const { productId } = req.params;

    const { data } = await db
      .from("consumer_lists")
      .delete()
      .eq("consumer_id", userId)
      .eq("list_type", list_type)
      .eq("product_id", productId)
      .select();

    getListItems(req, res);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "removeFromList",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type: list_type } = req.body;

    const { data } = await db
      .from("consumer_lists")
      .delete()
      .eq("consumer_id", userId)
      .eq("list_type", list_type)
      .select();

    res.status(200).json({ message: `${list_type} Cleared` });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "clearList",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
