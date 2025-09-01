import db from "../../lib/db.js";

export const addTransaction = async (orderId, transaction) => {
  try {
    const transactionData = {
      order_id: orderId,
      ...transaction,
    };

    const { data: newTransaction, error } = await db
      .from("transactions")
      .insert(transactionData)
      .select()
      .single();

    if (error) throw error;

    return newTransaction;
  } catch (err) {
    console.error("Error in addTransaction service:", err.message);
    throw err;
  }
};

export const cancelTransaction = async (orderId) => {
  try {
    const { data: transaction, error1 } = await db
      .from("transactions")
      .select()
      .eq("order_id", orderId)
      .single();

    if (error1) throw error1;

    const payment_status = transaction.payment_date ? "refunded" : "cancelled";

    const { data: updatedTransaction, error2 } = await db
      .from("transactions")
      .update({
        payment_status,
      })
      .eq("order_id", orderId)
      .select()
      .single();

    if (error2) throw error2;

    return updatedTransaction;
  } catch (err) {
    console.error("Error in cancelTransaction service:", err.message);
    throw err;
  }
};
