import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getListItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: listItems, error } = await db
      .from("consumer_lists")
      .select(
        "list_type, quantity, products(id, name, price, category, product_images)"
      )
      .eq("consumer_id", userId);

    if (error) throw error;

    const groupedList = listItems.reduce((acc, item) => {
      const { list_type, quantity, products } = item;
      if (!acc[list_type]) {
        acc[list_type] = [];
      }
      acc[list_type].push({ ...products, quantity });
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
    const productId = req.params.id;

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
    const { type: list_type } = req.query;
    const productId = req.params.id;

    const { data } = await db
      .from("consumer_lists")
      .delete()
      .eq("consumer_id", userId)
      .eq("list_type", list_type)
      .eq("product_id", productId);

    res.status(200).json("Item Removed From List");
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
