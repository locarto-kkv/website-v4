import db from "../../lib/db.js";

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: orders, error } = await db
      .from("orders")
      .select()
      .eq("consumer_id", userId);

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getOrders controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: orders, error } = await db
      .from("orders")
      .update({ order_status: "cancelled" })
      .eq("consumer_id", userId);

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in cancelOrder controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
