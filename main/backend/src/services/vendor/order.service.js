import db from "../../lib/db.js";

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
