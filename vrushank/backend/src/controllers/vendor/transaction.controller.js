import db from "../../lib/vendor/db.js";

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: productIds } = await db
      .from("products")
      .select("id")
      .eq("vendor_id", userId);
    console.log(productIds);

    const { data: orderIds } = await db
      .from("orders")
      .select("id")
      .eq("product_id", productIds);

    console.log(orderIds);

    const { data: transactions } = await db
      .from("transactions")
      .select()
      .eq("order_id", orderIds);

    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error in getTransactions controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
