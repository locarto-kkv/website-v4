import db from "../../lib/db.js";

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
