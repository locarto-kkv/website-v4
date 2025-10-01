import db from "../../lib/db.js";

export const getProducts = async (req, res) => {
  try {
    const { data: products } = await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProducts controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const { data: product } = await db
      .from("products")
      .delete()
      .eq("id", productId);

    res.status(200).json({ message: "Product Removed Successfully" });
  } catch (error) {
    console.log("Error in removeProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { name, price, quantity } = req.body;

    const { data: product } = await db
      .from("products")
      .update({ name, price, quantity })
      .eq("id", productId)
      .select()
      .single();

    res.status(200).json(product);
  } catch (error) {
    console.log("Error in editProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const restrictProduct = async (req, res) => {
  try {
    const { data: products } = await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in restrictProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
