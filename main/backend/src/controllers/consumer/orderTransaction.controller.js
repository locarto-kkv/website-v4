import {
  addOrder,
  cancelOrder,
} from "../../services/consumer/order.service.js";
import {
  addTransaction,
  cancelTransaction,
} from "../../services/consumer/transaction.service.js";
import db from "../../lib/db.js";

export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: ordersWithRelations, error } = await db
      .from("orders")
      .select(
        `
    *,
    product:products (*),
    transaction:transactions (*)
  `
      )
      .eq("consumer_id", userId);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    res.status(200).json(ordersWithRelations);
  } catch (error) {
    console.log("Error in getOrderHistory controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const placeOrderTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, order, transaction } = req.body;

    const newOrder = await addOrder(userId, productId, order);

    const newTransaction = await addTransaction(newOrder.id, transaction);

    res.status(200).json({ order: newOrder, transaction: newTransaction });
  } catch (error) {
    console.error("Error in placeOrderTransaction:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrderTransaction = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await cancelOrder(orderId);

    const updatedTransaction = await cancelTransaction(orderId);

    res.status(200).json({
      message: "Order cancelled successfully",
      orders: updatedOrder,
      transactions: updatedTransaction,
    });
  } catch (error) {
    console.error("Error in cancelOrderTransaction:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
