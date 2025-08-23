import db from "../../lib/vendor/db.js";

export const getTransactions = async (req, res) => {
  try {
    const orderId = req.body.id;
    const { data: transactions, error } = await db
      .from("transactions")
      .select()
      .eq("order_id", orderId);

    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error in getTransactions controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
