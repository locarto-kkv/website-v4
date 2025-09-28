import db from "../../lib/db.js";

export const addOrderService = async (userId, productId, order) => {
  try {
    const orderData = {
      ...order,
      product_id: productId,
      consumer_id: userId,
    };

    const { data: newOrder } = await db
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    return newOrder;
  } catch (error) {
    throw error;
  }
};

export const cancelOrderService = async (orderId) => {
  try {
    const { data: order } = await db
      .from("orders")
      .select()
      .eq("id", orderId)
      .single();

    const payment_status = order.payment_date ? "refunded" : "cancelled";

    const { data: updatedOrder } = await db
      .from("orders")
      .update({
        order_status: "cancelled",
        delivery_date: null,
        payment_status,
      })
      .eq("id", orderId)
      .select()
      .single();

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};
