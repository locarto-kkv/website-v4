import db from "../../lib/db.js";

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

export const addTransaction = async (req, res) => {
  try {
    const { title, content } = req.body;
    const orderId = req.body.order_id;

    const newTransaction = {
      title,
      content,
      editor: user.name,
    };

    const { data, error } = await db
      .from("transactions")
      .insert(newTransaction);

    res.status(201).json({ message: "Transaction Added" });
  } catch (error) {
    console.log("Error in addTransaction controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeTransaction = async (req, res) => {
  try {
    const { id: transactionId } = req.params;

    const product = await db
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    res.status(200).json({ message: "Transaction Removed Successfully" });
  } catch (error) {
    console.log("Error in removeTransaction controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editTransaction = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { name, price, quantity } = req.body;

    const updatedTransaction = await db
      .from("products")
      .update({ name, price, quantity })
      .eq("id", transactionId)
      .select()
      .single();

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.log("Error in editTransaction controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
