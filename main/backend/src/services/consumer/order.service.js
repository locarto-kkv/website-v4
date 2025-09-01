import db from "../../lib/db.js";

export const addOrder = async (userId, productId, order) => {
  try {
    const orderData = {
      ...order,
      product_id: productId,
      consumer_id: userId,
    };

    const { data: newOrder, error } = await db
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;

    return newOrder;
  } catch (err) {
    console.error("Error in addOrder service:", err.message);
    throw err;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const { data: updatedOrder, error } = await db
      .from("orders")
      .update({ order_status: "cancelled", delivery_date: null })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    return updatedOrder;
  } catch (err) {
    console.error("Error in cancelOrder service:", err.message);
    throw err;
  }
};
