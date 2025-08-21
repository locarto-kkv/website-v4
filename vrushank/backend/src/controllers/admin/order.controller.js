import db from "../../lib/vendor/db.js";

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: orders, error } = await db
      .from("orders")
      .select()
      .eq("vendor_id", userId);

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
      .select()
      .eq("vendor_id", userId);

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in cancelOrder controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: orders, error } = await db
      .from("orders")
      .select()
      .eq("vendor_id", userId);

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in updateOrderStatus controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSupportStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: orders, error } = await db
      .from("orders")
      .select()
      .eq("vendor_id", userId);

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in updateOrderStatus controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addOrder = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.user;

    const newProduct = {
      title,
      content,
      editor: user.name,
    };

    const { data, error } = await db.from("products").insert(newProduct);

    res.status(201).json({ message: "Product Added" });
  } catch (error) {
    console.log("Error in addOrders controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { name, price, quantity } = req.body;

    const { data: updatedOrder } = await db
      .from("order")
      .update({ name, price, quantity })
      .eq("id", orderId)
      .select()
      .single();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("Error in editOrder controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const { data, error } = await db.from("orders").delete().eq("id", orderId);

    res.status(200).json({ message: "Order Removed Successfully" });
  } catch (error) {
    console.log("Error in removeOrder controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
